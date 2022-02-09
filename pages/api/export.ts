import { getSession } from 'next-auth/react'
import { exportData } from '../../lib/db/db'
import { isAdmin, isLogin } from '../../lib/session'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  if (isAdmin(session)) {
    const d = await exportData(true)
    res.status(200).json(d)
  } else if (isLogin(session)) {
    const d = await exportData()
    res.status(200).json(d)
  } else {
    // Not Signed in
    res.status(401).send('Not logged in or edits are not permitted')
  }
  res.end()
}
