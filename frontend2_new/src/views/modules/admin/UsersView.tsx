import { Button, Card, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { adminApi, hrApi } from '@/utils/api'
import { getApiErrorMessage } from '@/utils/error'
import { useAuthStore } from '@/stores/auth'

type UserRole = 'ADMIN' | 'HR' | 'FINANCE' | 'INVENTORY' | 'EMPLOYEE'
type UserStatus = 'ACTIVE' | 'DISABLED'

type UserRow = {
  id: number
  fullName?: string
  email?: string
  role?: UserRole
  status?: UserStatus
  departmentName?: string
}

type UsersApiResponse = {
  users?: UserRow[]
  currentPage?: number
  totalItems?: number
  totalPages?: number
}

type CreateUserForm = {
  fullName: string
  email: string
  password: string
  role: UserRole
  departmentName: string
}

type EditUserForm = {
  fullName: string
  email: string
  role: UserRole
}

type ResetPasswordForm = {
  newPassword: string
}

export default function AdminUsersView() {
  const myRole = useAuthStore((s) => s.role)
  const isAdmin = String(myRole || '').toUpperCase() === 'ADMIN'

  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<UserRow[]>([])

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)

  const [q, setQ] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<UserStatus | undefined>(undefined)

  const [departments, setDepartments] = useState<{ id: number; name?: string }[]>([])

  const [createOpen, setCreateOpen] = useState(false)
  const [createSaving, setCreateSaving] = useState(false)
  const [createForm] = Form.useForm<CreateUserForm>()

  const [editOpen, setEditOpen] = useState(false)
  const [editSaving, setEditSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm] = Form.useForm<EditUserForm>()

  const [resetOpen, setResetOpen] = useState(false)
  const [resetSaving, setResetSaving] = useState(false)
  const [resetUserId, setResetUserId] = useState<number | null>(null)
  const [resetForm] = Form.useForm<ResetPasswordForm>()

  const roleOptions = useMemo(
    () =>
      (['ADMIN', 'HR', 'FINANCE', 'INVENTORY', 'EMPLOYEE'] as UserRole[]).map((r) => ({
        value: r,
        label: r
      })),
    []
  )

  const statusOptions = useMemo(
    () =>
      (['ACTIVE', 'DISABLED'] as UserStatus[]).map((s) => ({
        value: s,
        label: s
      })),
    []
  )

  const deptOptions = useMemo(
    () =>
      (departments || [])
        .filter((d) => Boolean(String(d.name || '').trim()))
        .map((d) => ({
          value: String(d.name),
          label: String(d.name)
        })),
    [departments]
  )

  async function loadDepartments() {
    try {
      setDepartments((await hrApi.listDepartments()) || [])
    } catch {
      setDepartments([])
    }
  }

  async function loadUsers(next?: { page?: number; pageSize?: number; role?: UserRole; status?: UserStatus }) {
    const nextPage = next?.page ?? page
    const nextPageSize = next?.pageSize ?? pageSize
    const nextRole = next?.role ?? roleFilter
    const nextStatus = next?.status ?? statusFilter

    setLoading(true)
    try {
      const res = (await adminApi.listUsers({
        page: Math.max(0, Number(nextPage) - 1),
        size: Number(nextPageSize),
        role: nextRole,
        status: nextStatus
      })) as UsersApiResponse

      setRows(res?.users || [])
      setTotal(Number(res?.totalItems || 0))
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load users'))
      setRows([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadDepartments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    void loadUsers({ page, pageSize })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, roleFilter, statusFilter])

  const filteredRows = useMemo(() => {
    const qq = q.trim().toLowerCase()
    if (!qq) return rows
    return (rows || []).filter((r) => {
      return (
        String(r.fullName || '').toLowerCase().includes(qq) ||
        String(r.email || '').toLowerCase().includes(qq)
      )
    })
  }, [q, rows])

  const columns: ColumnsType<UserRow> = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: 'Full Name', dataIndex: 'fullName', width: 220 },
    { title: 'Email', dataIndex: 'email', width: 240 },
    { title: 'Department', dataIndex: 'departmentName', width: 160 },
    {
      title: 'Role',
      dataIndex: 'role',
      width: 140,
      render: (v: any) => <Tag>{String(v || '-')}</Tag>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 140,
      render: (v: any) => {
        const s = String(v || '')
        if (s === 'ACTIVE') return <Tag color="green">ACTIVE</Tag>
        if (s === 'DISABLED') return <Tag color="red">DISABLED</Tag>
        return <Tag>{s || '-'}</Tag>
      }
    },
    {
      title: 'Action',
      key: 'action',
      width: 320,
      render: (_, r) => (
        <Space>
          <Button
            size="small"
            disabled={!isAdmin}
            onClick={() => {
              setEditingId(r.id)
              editForm.setFieldsValue({
                fullName: r.fullName || '',
                email: r.email || '',
                role: (r.role || 'EMPLOYEE') as UserRole
              })
              setEditOpen(true)
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            disabled={!isAdmin}
            onClick={() => {
              setResetUserId(r.id)
              resetForm.resetFields()
              setResetOpen(true)
            }}
          >
            Reset Password
          </Button>
          <Button
            size="small"
            disabled={!isAdmin}
            onClick={async () => {
              try {
                await adminApi.changeStatus(r.id)
                message.success('Status updated')
                await loadUsers()
              } catch (e: any) {
                message.error(getApiErrorMessage(e, 'Failed to change status'))
              }
            }}
          >
            Change Status
          </Button>
          <Popconfirm
            title="Delete user?"
            okText="Delete"
            okButtonProps={{ danger: true }}
            disabled={!isAdmin}
            onConfirm={async () => {
              try {
                await adminApi.deleteUser(r.id)
                message.success('Deleted')
                await loadUsers()
              } catch (e: any) {
                message.error(getApiErrorMessage(e, 'Failed to delete user'))
              }
            }}
          >
            <Button size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  const pagination: TablePaginationConfig = {
    current: page,
    pageSize,
    total,
    showSizeChanger: true,
    onChange: (p, ps) => {
      setPage(p)
      setPageSize(ps)
    }
  }

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between' }} align="start">
          <div>
            <Typography.Title level={4} style={{ margin: 0 }}>
              User Management
            </Typography.Title>
            <Typography.Text type="secondary">Create/update user, reset password, change status, dan delete user (khusus ADMIN).</Typography.Text>
            <div style={{ marginTop: 8 }}>
              <Space wrap>
                <Tag color={isAdmin ? 'green' : 'orange'}>Role: {String(myRole || '-')}</Tag>
                {!isAdmin ? <Typography.Text type="warning">Login sebagai ADMIN untuk memakai fitur ini.</Typography.Text> : null}
              </Space>
            </div>
          </div>
          <Space>
            <Button onClick={() => void loadUsers()} loading={loading}>
              Refresh
            </Button>
            <Button
              type="primary"
              disabled={!isAdmin}
              onClick={() => {
                createForm.resetFields()
                createForm.setFieldsValue({ role: 'EMPLOYEE' })
                void loadDepartments()
                setCreateOpen(true)
              }}
            >
              Create User
            </Button>
          </Space>
        </Space>
      </Card>

      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size={12}>
          <Input placeholder="Search name/email..." value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 320 }} />
          <Select allowClear placeholder="Filter role" value={roleFilter} options={roleOptions} onChange={(v) => setRoleFilter(v ?? undefined)} />
          <Select allowClear placeholder="Filter status" value={statusFilter} options={statusOptions} onChange={(v) => setStatusFilter(v ?? undefined)} />
        </Space>
      </Card>

      <Card>
        <Table<UserRow> rowKey="id" loading={loading} columns={columns} dataSource={filteredRows} pagination={pagination} />
      </Card>

      <Modal
        open={createOpen}
        title="Create User"
        okText="Create"
        confirmLoading={createSaving}
        onCancel={() => setCreateOpen(false)}
        onOk={async () => {
          try {
            const v = await createForm.validateFields()
            setCreateSaving(true)
            await adminApi.createUser({
              fullName: v.fullName,
              email: v.email,
              password: v.password,
              role: v.role,
              departmentName: v.departmentName
            })
            message.success('Created')
            setCreateOpen(false)
            await loadUsers({ page: 1 })
            setPage(1)
          } catch (e: any) {
            if (e?.errorFields) return
            const status = e?.response?.status
            if (status === 401 || status === 403) {
              message.error('Forbidden. Endpoint /admin/* hanya bisa diakses oleh role ADMIN.')
            } else {
              message.error(getApiErrorMessage(e, 'Failed to create user'))
            }
          } finally {
            setCreateSaving(false)
          }
        }}
      >
        <Form<CreateUserForm> form={createForm} layout="vertical" initialValues={{ role: 'EMPLOYEE' }}>
          <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, min: 8 }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select options={roleOptions} />
          </Form.Item>
          <Form.Item name="departmentName" label="Department" rules={[{ required: true }]}>
            <Select showSearch options={deptOptions} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={editOpen}
        title="Edit User"
        okText="Save"
        confirmLoading={editSaving}
        onCancel={() => {
          setEditOpen(false)
          setEditingId(null)
        }}
        onOk={async () => {
          if (!editingId) return
          try {
            const v = await editForm.validateFields()
            setEditSaving(true)
            await adminApi.updateUser(editingId, {
              fullName: v.fullName,
              email: v.email,
              role: v.role
            })
            message.success('Saved')
            setEditOpen(false)
            setEditingId(null)
            await loadUsers()
          } catch (e: any) {
            if (e?.errorFields) return
            message.error(getApiErrorMessage(e, 'Failed to update user'))
          } finally {
            setEditSaving(false)
          }
        }}
      >
        <Form<EditUserForm> form={editForm} layout="vertical">
          <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select options={roleOptions} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={resetOpen}
        title="Reset Password"
        okText="Reset"
        confirmLoading={resetSaving}
        onCancel={() => {
          setResetOpen(false)
          setResetUserId(null)
        }}
        onOk={async () => {
          if (!resetUserId) return
          try {
            const v = await resetForm.validateFields()
            setResetSaving(true)
            await adminApi.resetPassword(resetUserId, { newPassword: v.newPassword })
            message.success('Password reset')
            setResetOpen(false)
            setResetUserId(null)
          } catch (e: any) {
            if (e?.errorFields) return
            message.error(getApiErrorMessage(e, 'Failed to reset password'))
          } finally {
            setResetSaving(false)
          }
        }}
      >
        <Form<ResetPasswordForm> form={resetForm} layout="vertical">
          <Form.Item name="newPassword" label="New Password" rules={[{ required: true, min: 8 }]}>
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  )
}
