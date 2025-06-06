import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const ventaBoleto = await prisma.ventaBoleto.findMany()
  return NextResponse.json({ ventaBoleto })
}