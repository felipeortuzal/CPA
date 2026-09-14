export type CertificationId = 'CPA' | 'C-PRO-R' | 'C-PRO-I' | 'CFG' | 'CGA' | 'CGE'

export interface Certification {
  id: CertificationId
  name: string
  fullName: string
  available: boolean
}
