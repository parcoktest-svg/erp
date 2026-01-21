import { Button, Card, Input, InputNumber, Modal, Popconfirm, Select, Space, Switch, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { hrApi } from '@/utils/api'
import { getApiErrorMessage } from '@/utils/error'

type DepartmentRow = { id: number; name?: string }

type EmployeeRow = {
  id: number
  name?: string
  email?: string
  phone?: string
  role?: string
  departmentId?: number
  departmentName?: string
  baseSalary?: number
  bonus?: number
  deduction?: number
  performanceRating?: string
  active?: boolean
}

type EmployeeFormState = {
  name: string
  email: string
  phone: string
  role: string
  departmentId: number | null
  baseSalary: number
  bonus: number
  deduction: number
  performanceRating: string
  active: boolean
  password: string
}

function emptyEmployeeForm(): EmployeeFormState {
  return {
    name: '',
    email: '',
    phone: '',
    role: 'HR',
    departmentId: null,
    baseSalary: 0,
    bonus: 0,
    deduction: 0,
    performanceRating: '',
    active: true,
    password: ''
  }
}

export default function EmployeesView() {
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<EmployeeRow[]>([])

  const [deptOptions, setDeptOptions] = useState<DepartmentRow[]>([])

  const [q, setQ] = useState('')
  const [deptFilter, setDeptFilter] = useState<number | undefined>(undefined)

  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState<'create' | 'edit'>('create')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<EmployeeFormState>(() => emptyEmployeeForm())

  async function loadDepartments() {
    try {
      setDeptOptions((await hrApi.listDepartments()) || [])
    } catch {
      setDeptOptions([])
    }
  }

  async function loadEmployees() {
    setLoading(true)
    try {
      setRows((await hrApi.listEmployees()) || [])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load employees'))
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  async function load() {
    await Promise.all([loadDepartments(), loadEmployees()])
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deptSelectOptions = useMemo(
    () =>
      (deptOptions || []).map((d) => ({
        value: d.id,
        label: d.name ? `${d.name}` : String(d.id)
      })),
    [deptOptions]
  )

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase()
    return (rows || []).filter((r) => {
      if (deptFilter && Number(r.departmentId) !== Number(deptFilter)) return false
      if (!qq) return true
      return (
        String(r.name || '').toLowerCase().includes(qq) ||
        String(r.email || '').toLowerCase().includes(qq) ||
        String(r.phone || '').toLowerCase().includes(qq) ||
        String(r.departmentName || '').toLowerCase().includes(qq)
      )
    })
  }, [deptFilter, q, rows])

  const columns: ColumnsType<EmployeeRow> = [
    { title: 'Name', dataIndex: 'name', width: 200 },
    { title: 'Email', dataIndex: 'email', width: 220 },
    { title: 'Phone', dataIndex: 'phone', width: 160 },
    { title: 'Role', dataIndex: 'role', width: 120 },
    { title: 'Department', dataIndex: 'departmentName', width: 200 },
    {
      title: 'Active',
      dataIndex: 'active',
      width: 110,
      render: (v: any) => (v ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>)
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 280,
      render: (_, r) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              setEditMode('edit')
              setEditingId(r.id)
              setForm({
                name: r.name || '',
                email: r.email || '',
                phone: r.phone || '',
                role: r.role || 'HR',
                departmentId: r.departmentId ?? null,
                baseSalary: Number(r.baseSalary ?? 0),
                bonus: Number(r.bonus ?? 0),
                deduction: Number(r.deduction ?? 0),
                performanceRating: r.performanceRating || '',
                active: Boolean(r.active),
                password: ''
              })
              setOpen(true)
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            onClick={async () => {
              try {
                await hrApi.toggleEmployeeStatus(r.id)
                message.success('Updated status')
                await loadEmployees()
              } catch (e: any) {
                message.error(getApiErrorMessage(e, 'Failed to toggle status'))
              }
            }}
          >
            Toggle Status
          </Button>
          <Popconfirm
            title="Delete employee?"
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={async () => {
              try {
                await hrApi.deleteEmployee(r.id)
                message.success('Deleted')
                await loadEmployees()
              } catch (e: any) {
                message.error(getApiErrorMessage(e, 'Failed to delete employee'))
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

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <div>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Employees
            </Typography.Title>
            <Typography.Text type="secondary">Create, update, and manage employee status.</Typography.Text>
          </div>
          <Space>
            <Button onClick={() => void load()} loading={loading}>
              Refresh
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setEditMode('create')
                setEditingId(null)
                setForm(emptyEmployeeForm())
                setOpen(true)
              }}
            >
              New Employee
            </Button>
          </Space>
        </Space>
      </Card>

      <Card>
        <Space wrap style={{ marginBottom: 12 }}>
          <Input placeholder="Search name/email/phone" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 260 }} />
          <Select
            allowClear
            placeholder="Department"
            style={{ width: 240 }}
            value={deptFilter}
            options={deptSelectOptions}
            onChange={(v) => setDeptFilter(v ?? undefined)}
          />
        </Space>
        <Table<EmployeeRow> rowKey="id" loading={loading} columns={columns} dataSource={filtered} pagination={{ pageSize: 10 }} />
      </Card>

      <Modal
        open={open}
        title={editMode === 'create' ? 'Create Employee' : 'Edit Employee'}
        okText={editMode === 'create' ? 'Create' : 'Save'}
        confirmLoading={saving}
        onCancel={() => {
          setOpen(false)
          setSaving(false)
        }}
        onOk={async () => {
          try {
            if (!form.name.trim()) {
              message.error('Name is required')
              return
            }
            if (!form.role.trim()) {
              message.error('Role is required')
              return
            }
            if (!form.departmentId) {
              message.error('Department is required')
              return
            }
            setSaving(true)
            const payload: any = {
              name: form.name,
              email: form.email,
              phone: form.phone,
              role: form.role,
              departmentId: form.departmentId,
              baseSalary: Number(form.baseSalary || 0),
              bonus: Number(form.bonus || 0),
              deduction: Number(form.deduction || 0),
              performanceRating: form.performanceRating || null,
              active: Boolean(form.active)
            }
            if (form.password && form.password.trim()) payload.password = form.password

            if (editMode === 'create') {
              await hrApi.createEmployee(payload)
              message.success('Created')
            } else {
              if (editingId == null) {
                message.error('Employee id is missing')
                return
              }
              await hrApi.updateEmployee(editingId, payload)
              message.success('Saved')
            }

            setOpen(false)
            await loadEmployees()
          } catch (e: any) {
            message.error(getApiErrorMessage(e, 'Failed'))
          } finally {
            setSaving(false)
          }
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size={12}>
          <Input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="Name" />
          <Input value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} placeholder="Email" />
          <Input value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} placeholder="Phone" />
          <Select
            placeholder="Role"
            value={form.role}
            onChange={(v) => setForm((s) => ({ ...s, role: v }))}
            options={[
              { value: 'ADMIN', label: 'ADMIN' },
              { value: 'HR', label: 'HR' },
              { value: 'INVENTORY', label: 'INVENTORY' },
              { value: 'FINANCE', label: 'FINANCE' }
            ]}
          />
          <Select
            placeholder="Department"
            value={form.departmentId ?? undefined}
            onChange={(v) => setForm((s) => ({ ...s, departmentId: v ?? null }))}
            options={deptSelectOptions}
          />

          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Typography.Text type="secondary">Active</Typography.Text>
            <Switch checked={form.active} onChange={(v) => setForm((s) => ({ ...s, active: v }))} />
          </Space>

          <InputNumber
            style={{ width: '100%' }}
            value={form.baseSalary}
            onChange={(v) => setForm((s) => ({ ...s, baseSalary: Number(v ?? 0) }))}
            placeholder="Base Salary"
          />
          <InputNumber
            style={{ width: '100%' }}
            value={form.bonus}
            onChange={(v) => setForm((s) => ({ ...s, bonus: Number(v ?? 0) }))}
            placeholder="Bonus"
          />
          <InputNumber
            style={{ width: '100%' }}
            value={form.deduction}
            onChange={(v) => setForm((s) => ({ ...s, deduction: Number(v ?? 0) }))}
            placeholder="Deduction"
          />
          <Input value={form.performanceRating} onChange={(e) => setForm((s) => ({ ...s, performanceRating: e.target.value }))} placeholder="Performance Rating" />
          <Input.Password
            value={form.password}
            onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
            placeholder={editMode === 'create' ? 'Password (optional)' : 'Password (set to change)'}
          />
        </Space>
      </Modal>
    </Space>
  )
}
