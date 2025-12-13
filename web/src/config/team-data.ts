export interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  phone: string
  status: "active" | "inactive"
  joinedDate: string
}

export const TEAM_DATA: TeamMember[] = [
  {
    id: "TM-001",
    name: "Budi Santoso",
    role: "Fotografer Utama",
    email: "budi.s@duaarah.com",
    phone: "0812-3456-7890",
    status: "active",
    joinedDate: "2023-01-15"
  },
  {
    id: "TM-002",
    name: "Siti Rahma",
    role: "Makeup Artist",
    email: "siti.mua@gmail.com",
    phone: "0819-8765-4321",
    status: "active",
    joinedDate: "2023-03-10"
  },
  {
    id: "TM-003",
    name: "Ahmad Rizky",
    role: "Videographer",
    email: "rizky.vid@duaarah.com",
    phone: "0856-7890-1234",
    status: "active",
    joinedDate: "2023-06-20"
  },
  {
    id: "TM-004",
    name: "Dina Wijaya",
    role: "Editor",
    email: "dina.edit@duaarah.com",
    phone: "0813-4567-8901",
    status: "active",
    joinedDate: "2023-02-01"
  },
  {
    id: "TM-005",
    name: "Rina Kartika",
    role: "Asisten",
    email: "rina.asst@duaarah.com",
    phone: "0815-6789-0123",
    status: "inactive",
    joinedDate: "2023-08-15"
  }
]
