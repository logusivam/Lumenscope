import express from 'express';
import { sendEmail } from '../utils/mail.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Email address is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address format' });
  }

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (message.length > 500) {
    return res.status(400).json({ error: 'Message cannot exceed 500 characters' });
  }

  try {
    await sendEmail({
      name: name.trim(),
      email: email.trim(),
      message: message.trim()
    });
    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Contact email sending error:', error.message);
    res.status(500).json({ error: 'Failed to send your message. Please try again later.' });
  }
});

export default router;
