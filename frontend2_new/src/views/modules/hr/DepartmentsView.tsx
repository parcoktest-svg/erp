import { Button, Card, Form, Input, Modal, Popconfirm, Space, Table, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { hrApi } from '@/utils/api'
import { getApiErrorMessage } from '@/utils/error'

type DepartmentRow = {
  id: number
  name?: string
}

export default function DepartmentsView() {
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<DepartmentRow[]>([])

  const [q, setQ] = useState('')

  const [createOpen, setCreateOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [createForm] = Form.useForm()

  const [editOpen, setEditOpen] = useState(false)
  const [editSaving, setEditSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm] = Form.useForm()

  async function load() {
    setLoading(true)
    try {
      setRows((await hrApi.listDepartments()) || [])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load departments'))
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase()
    return (rows || []).filter((r) => {
      if (!qq) return true
      return String(r.name || '').toLowerCase().includes(qq)
    })
  }, [q, rows])

  const columns: ColumnsType<DepartmentRow> = [
    { title: 'ID', dataIndex: 'id', width: 90 },
    { title: 'Name', dataIndex: 'name' },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, r) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              setEditingId(r.id)
              editForm.setFieldsValue({ name: r.name || '' })
              setEditOpen(true)
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete department?"
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={async () => {
              try {
                await hrApi.deleteDepartment(r.id)
                message.success('Deleted')
                await load()
              } catch (e: any) {
                message.error(getApiErrorMessage(e, 'Failed to delete department'))
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
              Departments
            </Typography.Title>
            <Typography.Text type="secondary">Master data department untuk employee.</Typography.Text>
          </div>
          <Space>
            <Button onClick={() => void load()} loading={loading}>
              Refresh
            </Button>
            <Button
              type="primary"
              onClick={() => {
                createForm.resetFields()
                setCreateOpen(true)
              }}
            >
              New Department
            </Button>
          </Space>
        </Space>
      </Card>

      <Card>
        <Space style={{ marginBottom: 12 }} wrap>
          <Input placeholder="Search name" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 260 }} />
        </Space>
        <Table<DepartmentRow> rowKey="id" loading={loading} columns={columns} dataSource={filtered} pagination={{ pageSize: 10 }} />
      </Card>

      <Modal
        open={createOpen}
        title="Create Department"
        okText="Create"
        confirmLoading={saving}
        onCancel={() => setCreateOpen(false)}
        onOk={async () => {
          try {
            const v = await createForm.validateFields()
            setSaving(true)
            await hrApi.createDepartment({ name: v.name })
            message.success('Created')
            setCreateOpen(false)
            await load()
          } catch (e: any) {
            if (e?.errorFields) {
              message.error('Please complete required fields')
              return
            }
            message.error(getApiErrorMessage(e, 'Failed to create department'))
          } finally {
            setSaving(false)
          }
        }}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={editOpen}
        title="Edit Department"
        okText="Save"
        confirmLoading={editSaving}
        onCancel={() => {
          setEditOpen(false)
          setEditingId(null)
        }}
        onOk={async () => {
          if (editingId == null) {
            message.error('Department id is missing')
            return
          }
          try {
            const v = await editForm.validateFields()
            setEditSaving(true)
            await hrApi.updateDepartment(editingId, { name: v.name })
            message.success('Saved')
            setEditOpen(false)
            setEditingId(null)
            await load()
          } catch (e: any) {
            if (e?.errorFields) {
              message.error('Please complete required fields')
              return
            }
            message.error(getApiErrorMessage(e, 'Failed to update department'))
          } finally {
            setEditSaving(false)
          }
        }}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  )
}
