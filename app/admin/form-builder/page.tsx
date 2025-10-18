'use client'

import { useState, useEffect } from 'react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { toast } from '@/hooks/use-toast'
import {
  Plus,
  Trash2,
  Eye,
  Download,
  Upload,
  Copy,
  Edit,
  Settings,
  GripVertical,
  Type,
  Mail,
  Phone,
  Calendar,
  CheckSquare,
  Circle,
  List,
  FileText,
  Hash,
  Clock,
  Link,
  Image,
  Star,
  Sliders,
  ToggleLeft,
  AlignLeft,
  Palette,
} from 'lucide-react'

// Custom styles for the form builder
const customStyles = `
  .slider {
    -webkit-appearance: none;
    appearance: none;
  }
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #9333ea;
    cursor: pointer;
  }
  .slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #9333ea;
    cursor: pointer;
    border: none;
  }
`

interface FormField {
  id: string
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'time' | 'number' | 'url' | 'file' | 'rating' | 'range' | 'toggle' | 'divider'
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
    min?: number
    max?: number
  }
  styling?: {
    width?: 'full' | 'half' | 'third'
    backgroundColor?: string
    textColor?: string
    borderColor?: string
  }
}

interface FormData {
  id: string
  title: string
  description: string
  fields: FormField[]
  styling: {
    backgroundColor: string
    primaryColor: string
    backgroundImage: boolean
  }
  settings: {
    allowMultipleSubmissions: boolean
    requireLogin: boolean
    showProgressBar: boolean
    emailNotifications: boolean
    autoSave: boolean
  }
  createdAt: string
  updatedAt: string
}

const fieldTypes = [
  { type: 'text', label: 'Text Input', icon: Type },
  { type: 'email', label: 'Email', icon: Mail },
  { type: 'phone', label: 'Phone', icon: Phone },
  { type: 'textarea', label: 'Text Area', icon: AlignLeft },
  { type: 'select', label: 'Dropdown', icon: List },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { type: 'radio', label: 'Radio Button', icon: Circle },
  { type: 'date', label: 'Date', icon: Calendar },
  { type: 'time', label: 'Time', icon: Clock },
  { type: 'number', label: 'Number', icon: Hash },
  { type: 'url', label: 'URL', icon: Link },
  { type: 'file', label: 'File Upload', icon: Upload },
  { type: 'rating', label: 'Rating', icon: Star },
  { type: 'range', label: 'Range/Slider', icon: Sliders },
  { type: 'toggle', label: 'Toggle Switch', icon: ToggleLeft },
  { type: 'divider', label: 'Section Divider', icon: Separator },
]

export default function FormBuilderPage() {
  const [forms, setForms] = useState<FormData[]>([])
  const [currentForm, setCurrentForm] = useState<FormData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)

  // Add custom styles
  useEffect(() => {
    const styleElement = document.createElement('style')
    styleElement.textContent = customStyles
    document.head.appendChild(styleElement)
    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  // Load saved forms from localStorage
  useEffect(() => {
    const savedForms = localStorage.getItem('formBuilderForms')
    if (savedForms) {
      setForms(JSON.parse(savedForms))
    }
  }, [])

  // Save forms to localStorage
  const saveForms = (updatedForms: FormData[]) => {
    localStorage.setItem('formBuilderForms', JSON.stringify(updatedForms))
    setForms(updatedForms)
  }

  const createNewForm = () => {
    const newForm: FormData = {
      id: `form_${Date.now()}`,
      title: 'Untitled Form',
      description: '',
      fields: [],
      styling: {
        backgroundColor: '#ffffff',
        primaryColor: '#3b82f6',
        backgroundImage: true,
      },
      settings: {
        allowMultipleSubmissions: true,
        requireLogin: false,
        showProgressBar: true,
        emailNotifications: true,
        autoSave: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setCurrentForm(newForm)
    setIsEditing(true)
    setPreviewMode(false)
  }

  const saveCurrentForm = () => {
    if (!currentForm) return

    const updatedForm = {
      ...currentForm,
      updatedAt: new Date().toISOString(),
    }

    const existingIndex = forms.findIndex(f => f.id === updatedForm.id)
    let updatedForms: FormData[]

    if (existingIndex >= 0) {
      updatedForms = [...forms]
      updatedForms[existingIndex] = updatedForm
    } else {
      updatedForms = [...forms, updatedForm]
    }

    saveForms(updatedForms)
    setCurrentForm(updatedForm)
    toast({
      title: 'Form Saved',
      description: 'Your form has been saved successfully.',
    })
  }

  const deleteForm = (formId: string) => {
    const updatedForms = forms.filter(f => f.id !== formId)
    saveForms(updatedForms)
    if (currentForm?.id === formId) {
      setCurrentForm(null)
      setIsEditing(false)
    }
    toast({
      title: 'Form Deleted',
      description: 'The form has been deleted successfully.',
    })
  }

  const addField = (fieldType: FormField['type']) => {
    if (!currentForm) return

    const newField: FormField = {
      id: `field_${Date.now()}`,
      type: fieldType,
      label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
      placeholder: fieldType === 'divider' ? '' : `Enter ${fieldType}...`,
      required: false,
      options: ['select', 'radio', 'checkbox'].includes(fieldType) ? ['Option 1', 'Option 2'] : undefined,
      validation: {},
      styling: {
        width: 'full',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        borderColor: '#d1d5db',
      },
    }

    setCurrentForm({
      ...currentForm,
      fields: [...currentForm.fields, newField],
    })
  }

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    if (!currentForm) return

    setCurrentForm({
      ...currentForm,
      fields: currentForm.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      ),
    })
  }

  const deleteField = (fieldId: string) => {
    if (!currentForm) return

    setCurrentForm({
      ...currentForm,
      fields: currentForm.fields.filter(field => field.id !== fieldId),
    })
  }

  const duplicateField = (fieldId: string) => {
    if (!currentForm) return

    const field = currentForm.fields.find(f => f.id === fieldId)
    if (!field) return

    const duplicatedField: FormField = {
      ...field,
      id: `field_${Date.now()}`,
      label: `${field.label} (Copy)`,
    }

    const fieldIndex = currentForm.fields.findIndex(f => f.id === fieldId)
    const newFields = [...currentForm.fields]
    newFields.splice(fieldIndex + 1, 0, duplicatedField)

    setCurrentForm({
      ...currentForm,
      fields: newFields,
    })
  }

  const exportForm = () => {
    if (!currentForm) return

    const dataStr = JSON.stringify(currentForm, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${currentForm.title.replace(/\s+/g, '_')}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const importForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const formData = JSON.parse(e.target?.result as string) as FormData
        formData.id = `form_${Date.now()}` // Generate new ID
        formData.createdAt = new Date().toISOString()
        formData.updatedAt = new Date().toISOString()
        
        const updatedForms = [...forms, formData]
        saveForms(updatedForms)
        setCurrentForm(formData)
        setIsEditing(true)
        
        toast({
          title: 'Form Imported',
          description: 'The form has been imported successfully.',
        })
      } catch (error) {
        toast({
          title: 'Import Failed',
          description: 'Failed to import the form. Please check the file format.',
          variant: 'destructive',
        })
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1">
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto p-6 space-y-6 max-w-6xl">
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border p-6">
          <div>
            <h1 className="text-2xl font-medium text-gray-900">Form Builder</h1>
            <p className="text-gray-600 mt-1">Create and manage interactive forms</p>
          </div>
          
          <div className="flex items-center gap-3">
            {currentForm && (
              <>
                <Button
                  variant={previewMode ? 'default' : 'outline'}
                  onClick={() => setPreviewMode(!previewMode)}
                  className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {previewMode ? 'Edit Mode' : 'Preview'}
                </Button>
                
                <Button
                  onClick={saveCurrentForm}
                  className="bg-blue-600 hover:bg-blue-700 text-white border-0"
                >
                  Save Form
                </Button>
              </>
            )}
            
            <Button
              onClick={createNewForm}
              className="bg-purple-600 hover:bg-purple-700 text-white border-0"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Form
            </Button>
          </div>
        </div>

        {!currentForm ? (
          // Forms List View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forms.map((form) => (
              <Card key={form.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-gray-900 text-lg font-medium">{form.title}</CardTitle>
                  <p className="text-gray-600 text-sm">{form.description || 'No description'}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{form.fields.length} fields</span>
                    <span>{new Date(form.updatedAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentForm(form)
                        setIsEditing(true)
                        setPreviewMode(false)
                      }}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentForm(form)
                        setIsEditing(false)
                        setPreviewMode(true)
                      }}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteForm(form.id)}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {forms.length === 0 && (
              <div className="col-span-full text-center py-16">
                <div className="bg-white rounded-lg border border-gray-200 p-12">
                  <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No forms yet</h3>
                  <p className="text-gray-600 mb-6">Get started by creating your first form</p>
                  <Button
                    onClick={createNewForm}
                    className="bg-purple-600 hover:bg-purple-700 text-white border-0"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Form
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Form Editor/Preview
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {!previewMode && (
              // Field Types Panel
              <div className="lg:col-span-1">
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-gray-900 text-lg font-medium">Add Fields</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-2">
                        {fieldTypes.map((fieldType) => {
                          const Icon = fieldType.icon as any
                          return (
                            <Button
                              key={fieldType.type}
                              variant="outline"
                              className="w-full justify-start bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-purple-300"
                              onClick={() => addField(fieldType.type as FormField['type'])}
                            >
                              <Icon className="mr-3 h-4 w-4" />
                              {fieldType.label}
                            </Button>
                          )
                        })}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Main Form Area */}
            <div className={previewMode ? 'lg:col-span-4' : 'lg:col-span-3'}>
              <Card className="bg-white border border-gray-200">
                <CardHeader className="border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {isEditing && !previewMode ? (
                        <div className="space-y-3">
                          <Input
                            value={currentForm.title}
                            onChange={(e) => setCurrentForm({ ...currentForm, title: e.target.value })}
                            className="text-xl font-medium bg-transparent border-0 px-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:border-0"
                            placeholder="Form Title"
                          />
                          <Textarea
                            value={currentForm.description}
                            onChange={(e) => setCurrentForm({ ...currentForm, description: e.target.value })}
                            className="bg-transparent border-0 px-0 text-gray-600 placeholder-gray-400 focus:ring-0 focus:border-0 resize-none"
                            placeholder="Form Description"
                            rows={2}
                          />
                        </div>
                      ) : (
                        <div>
                          <CardTitle className="text-gray-900 text-xl">{currentForm.title}</CardTitle>
                          {currentForm.description && (
                            <p className="text-gray-600 mt-2">{currentForm.description}</p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={exportForm}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      <label className="cursor-pointer">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          asChild
                        >
                          <span>
                            <Upload className="h-4 w-4" />
                          </span>
                        </Button>
                        <input
                          type="file"
                          accept=".json"
                          onChange={importForm}
                          className="hidden"
                        />
                      </label>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentForm(null)
                          setIsEditing(false)
                          setPreviewMode(false)
                        }}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Back to List
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                      {currentForm.fields.map((field, index) => (
                        <FormFieldComponent
                          key={field.id}
                          field={field}
                          isEditing={isEditing && !previewMode}
                          isSelected={selectedFieldId === field.id}
                          onSelect={() => setSelectedFieldId(field.id)}
                          onUpdate={(updates) => updateField(field.id, updates)}
                          onDelete={() => deleteField(field.id)}
                          onDuplicate={() => duplicateField(field.id)}
                        />
                      ))}
                      
                      {currentForm.fields.length === 0 && !previewMode && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                          <p className="text-gray-500">
                            Add fields from the panel on the left to start building your form
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Form Field Component
interface FormFieldComponentProps {
  field: FormField
  isEditing: boolean
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<FormField>) => void
  onDelete: () => void
  onDuplicate: () => void
}

function FormFieldComponent({
  field,
  isEditing,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
}: FormFieldComponentProps) {
  const [showSettings, setShowSettings] = useState(false)

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'url':
      case 'number':
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
            disabled={isEditing}
          />
        )
      
      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
            disabled={isEditing}
            rows={3}
          />
        )
      
      case 'select':
        return (
          <Select disabled={isEditing}>
            <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500">
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      
      case 'checkbox':
        return (
          <div className="space-y-3">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Checkbox disabled={isEditing} className="border-gray-300" />
                <label className="text-gray-900 text-sm">{option}</label>
              </div>
            ))}
          </div>
        )
      
      case 'radio':
        return (
          <div className="space-y-3">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name={field.id}
                  disabled={isEditing}
                  className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <label className="text-gray-900 text-sm">{option}</label>
              </div>
            ))}
          </div>
        )
      
      case 'date':
        return (
          <Input
            type="date"
            className="bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500"
            disabled={isEditing}
          />
        )
      
      case 'time':
        return (
          <Input
            type="time"
            className="bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500"
            disabled={isEditing}
          />
        )
      
      case 'file':
        return (
          <Input
            type="file"
            className="bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500"
            disabled={isEditing}
          />
        )
      
      case 'rating':
        return (
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-6 w-6 text-yellow-400 fill-current" />
            ))}
          </div>
        )
      
      case 'range':
        return (
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="100"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              disabled={isEditing}
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>0</span>
              <span>100</span>
            </div>
          </div>
        )
      
      case 'toggle':
        return (
          <label className="flex items-center space-x-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                disabled={isEditing}
              />
              <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>
              <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition shadow"></div>
            </div>
            <span className="text-gray-900 text-sm">Toggle option</span>
          </label>
        )
      
      case 'divider':
        return (
          <div className="py-4">
            <Separator className="bg-gray-200" />
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div
      className={`relative p-6 rounded-lg border transition-all bg-white ${
        isSelected 
          ? 'border-purple-500 ring-2 ring-purple-100' 
          : 'border-gray-200 hover:border-gray-300'
      } ${isEditing ? 'cursor-pointer' : ''}`}
      onClick={isEditing ? onSelect : undefined}
    >
      {isEditing && (
        <div className="absolute top-4 right-4 flex items-center gap-1">
          <Sheet open={showSettings} onOpenChange={setShowSettings}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900">
                <Settings className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-white">
              <SheetHeader>
                <SheetTitle className="text-gray-900">Field Settings</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                <div>
                  <Label className="text-gray-700">Label</Label>
                  <Input
                    value={field.label}
                    onChange={(e) => onUpdate({ label: e.target.value })}
                    className="bg-white border-gray-300 text-gray-900"
                  />
                </div>
                
                {field.type !== 'divider' && (
                  <div>
                    <Label className="text-gray-700">Placeholder</Label>
                    <Input
                      value={field.placeholder || ''}
                      onChange={(e) => onUpdate({ placeholder: e.target.value })}
                      className="bg-white border-gray-300 text-gray-900"
                    />
                  </div>
                )}
                
                {field.type !== 'divider' && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.required}
                      onCheckedChange={(checked) => onUpdate({ required: checked as boolean })}
                    />
                    <Label className="text-gray-700">Required</Label>
                  </div>
                )}
                
                {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                  <div>
                    <Label className="text-gray-700">Options (one per line)</Label>
                    <Textarea
                      value={field.options?.join('\n') || ''}
                      onChange={(e) => onUpdate({ options: e.target.value.split('\n').filter(Boolean) })}
                      rows={4}
                      className="bg-white border-gray-300 text-gray-900"
                    />
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onDuplicate()
            }}
            className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900"
          >
            <Copy className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {field.type !== 'divider' && (
        <div className="mb-4 flex items-center gap-2">
          <Label className="text-gray-900 font-medium text-sm">{field.label}</Label>
          {field.required && (
            <Badge variant="destructive" className="text-xs bg-red-100 text-red-800 border-red-200">Required</Badge>
          )}
        </div>
      )}
      
      {renderField()}
    </div>
  )
}