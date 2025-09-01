'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  BadgeCheck,
  Copy,
  MoreVertical,
  RefreshCw,
  Trash2,
  UserCog,
} from 'lucide-react'
import type { AdminUser } from '@/types/admin'

const roleStripe: Record<AdminUser['role'], string> = {
  super_admin: 'bg-gradient-to-r from-indigo-600 to-fuchsia-600',
  content_manager: 'bg-gradient-to-r from-emerald-600 to-teal-600',
  news_editor: 'bg-gradient-to-r from-sky-600 to-cyan-600',
}
const roleBadge: Record<AdminUser['role'], string> = {
  super_admin: 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white',
  content_manager: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white',
  news_editor: 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white',
}

export function AdminIdCard({
  user,
  onCopyEmail,
  onOpenRoleModal,
  onResetPassword,
  onRemoveUser,
}: {
  user: AdminUser
  onCopyEmail: (email: string) => void
  onOpenRoleModal: (u: AdminUser) => void
  onResetPassword: (id: string) => void
  onRemoveUser: (id: string) => void
}) {
  return (
    <Card className='relative overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:ring-1 hover:ring-primary/20'>
      {/* Strap + hole (ID tag vibe) */}
      <div className='pointer-events-none absolute -top-6 left-1/2 h-6 w-[2px] -translate-x-1/2 bg-gradient-to-b from-primary/50 to-transparent' />
      <div className='pointer-events-none absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full border bg-background shadow-inner' />
      {/* Top stripe by role */}
      <div className={`h-2 ${roleStripe[user.role]}`} />

      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3 min-w-0'>
            <div className='relative'>
              <Avatar className='shadow-sm ring-1 ring-black/5'>
                <AvatarFallback>
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <BadgeCheck className='absolute -bottom-1 -right-1 h-4 w-4 text-primary bg-white rounded-full' />
            </div>
            <div className='min-w-0'>
              <CardTitle className='text-base truncate'>{user.name}</CardTitle>
              <CardDescription className='truncate'>
                {user.email}
              </CardDescription>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                aria-label='More'
                className='cursor-pointer hover:bg-muted'
              >
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='cursor-pointer'>
              <DropdownMenuItem
                onClick={() => onCopyEmail(user.email)}
                className='cursor-pointer'
              >
                <Copy className='h-4 w-4 mr-2' /> Copy email
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onOpenRoleModal(user)}
                className='cursor-pointer'
              >
                <UserCog className='h-4 w-4 mr-2' /> Change role
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onResetPassword(user.id)}
                className='cursor-pointer'
              >
                <RefreshCw className='h-4 w-4 mr-2' /> Reset password
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onRemoveUser(user.id)}
                className='cursor-pointer text-destructive focus:text-destructive'
              >
                <Trash2 className='h-4 w-4 mr-2' /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className='pt-0 pb-4'>
        <div className='flex items-center justify-between'>
          <Badge className={roleBadge[user.role] + ' border-0'}>
            {user.role.replace('_', ' ')}
          </Badge>
          <div className='text-xs text-muted-foreground'>
            {user.lastLoginAt
              ? `Last login: ${new Date(user.lastLoginAt).toLocaleString()}`
              : 'Never logged in'}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
