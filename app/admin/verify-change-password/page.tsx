import VerifyChangePasswordClient from "@/components/admin/verify-change-password.client"

export default function Page({
  searchParams,
}: {
  searchParams: { id?: string; token?: string }
}) {
  const id = searchParams?.id
  const token = searchParams?.token
  return <VerifyChangePasswordClient id={id} token={token} />
}
  