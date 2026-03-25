// ─── Appointment Routes ───
// Lab Q23: Full appointment details (INNER JOIN)
// Lab Step 13: UPDATE/INSERT/DELETE examples
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/appointments — Lab Q23: INNER JOIN
router.get('/', authenticate, async (req, res) => {
  try {
    // Lab Q23: Full appointment details at MediCare Clinic (INNER JOIN)
    let query = `
      SELECT
        a.AppointmentId AS id, a.PatientId AS patient_id, a.DoctorId AS doctor_id,
        a.AppDate AS date, a.AppTime AS time, a.Status AS status, a.Reason AS reason,
        p.Name AS patient_name, p.Phone AS patient_phone, p.BloodGroup AS blood_group,
        d.Name AS doctor_name, d.Specialization AS specialization, d.Phone AS doctor_phone
      FROM Appointments a
      INNER JOIN Patients p ON a.PatientId = p.PatientId
      INNER JOIN Doctors  d ON a.DoctorId  = d.DoctorId
    `;
    const params = [];

    // Role-based filtering
    if (req.user.role === 'doctor') {
      query += ' WHERE a.DoctorId = ?';
      params.push(req.user.id);
    } else if (req.user.role === 'patient') {
      query += ' WHERE a.PatientId = ?';
      params.push(req.user.id);
    }

    query += ' ORDER BY a.AppDate DESC, a.AppTime DESC';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/appointments/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        a.AppointmentId, a.PatientId, a.DoctorId,
        a.AppDate, a.AppTime, a.Status, a.Reason,
        p.Name AS PatientName, p.Phone AS PatientPhone,
        d.Name AS DoctorName, d.Specialization
      FROM Appointments a
      INNER JOIN Patients p ON a.PatientId = p.PatientId
      INNER JOIN Doctors  d ON a.DoctorId  = d.DoctorId
      WHERE a.AppointmentId = ?
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Appointment not found.' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/appointments — Lab Step 3: INSERT INTO Appointments
router.post('/', authenticate, authorize('admin', 'patient'), async (req, res) => {
  try {
    let { patient_id, doctor_id, date, time, status, reason } = req.body;

    // If patient is booking, enforce their own ID
    if (req.user.role === 'patient') {
      patient_id = req.user.id;
      status = 'Scheduled'; // Patients can't set status
    }

    if (!patient_id || !doctor_id || !date || !time) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const [result] = await db.query(
      `INSERT INTO Appointments (PatientId, DoctorId, AppDate, AppTime, Status, Reason)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [patient_id, doctor_id, date, time, status || 'Scheduled', reason]
    );
    res.status(201).json({ id: result.insertId, message: 'Appointment booked successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/appointments/:id — Lab Step 13: UPDATE Appointments SET Status = ?
router.put('/:id', authenticate, authorize('admin', 'doctor'), async (req, res) => {
  try {
    const { patient_id, doctor_id, date, time, status, reason } = req.body;

    // Doctors can only update status of their own appointments
    if (req.user.role === 'doctor') {
      const [existing] = await db.query('SELECT * FROM Appointments WHERE AppointmentId = ? AND DoctorId = ?', [req.params.id, req.user.id]);
      if (existing.length === 0) return res.status(403).json({ error: 'Not your appointment.' });

      // Lab Step 13: UPDATE Appointments SET Status = 'Completed' WHERE AppointmentId = ?
      await db.query('UPDATE Appointments SET Status = ? WHERE AppointmentId = ?', [status, req.params.id]);
      return res.json({ message: 'Appointment status updated.' });
    }

    // Admin can update everything
    const [result] = await db.query(
      `UPDATE Appointments SET PatientId=?, DoctorId=?, AppDate=?, AppTime=?, Status=?, Reason=?
       WHERE AppointmentId=?`,
      [patient_id, doctor_id, date, time, status, reason, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Appointment not found.' });
    res.json({ message: 'Appointment updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/appointments/:id
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Appointments WHERE AppointmentId = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Appointment not found.' });
    res.json({ message: 'Appointment deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
