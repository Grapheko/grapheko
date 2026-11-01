export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const { email, prenom, source } = req.body || {}
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Email invalide' })
  }
  if (!process.env.BREVO_API_KEY) {
    return res.status(500).json({ error: 'BREVO_API_KEY manquante' })
  }
  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        attributes: { PRENOM: prenom || '', SOURCE: `grapheko-${String(source || 'site').slice(0, 40)}` },
        listIds: [3],
        updateEnabled: true,
      }),
    })
    if (response.status === 201 || response.status === 204) {
      return res.status(200).json({ success: true })
    }
    const data = await response.json()
    console.error('subscribe brevo', response.status, JSON.stringify(data).slice(0, 300))
    if (data.code === 'duplicate_parameter') {
      return res.status(200).json({ success: true })
    }
    return res.status(500).json({ error: 'Erreur Brevo' })
  } catch (error) {
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}
