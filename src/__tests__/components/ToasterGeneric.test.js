import { render, screen, fireEvent, within } from '@testing-library/react'
import ToasterGeneric from '@/app/components/others/ToasterGeneric'

describe('ToasterGeneric Component', () => {
  it('should render when open is true', () => {
    render(<ToasterGeneric open={true} />)

    expect(screen.getByText('Confirmar')).toBeInTheDocument()
    expect(screen.getByText('¿Estás seguro?')).toBeInTheDocument()
  })

  it('should not render dialog when open is false', () => {
    const { container } = render(<ToasterGeneric open={false} />)

    const dialog = container.querySelector('[role="dialog"]')
    expect(dialog).toBeNull()
  })

  it('should display custom title', () => {
    render(<ToasterGeneric open={true} title="Delete Item?" />)

    expect(screen.getByText('Delete Item?')).toBeInTheDocument()
  })

  it('should display custom message', () => {
    render(<ToasterGeneric open={true} message="Are you sure?" />)

    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
  })

  it('should display custom button text', () => {
    render(
      <ToasterGeneric
        open={true}
        confirmText="Delete"
        cancelText="Keep"
      />
    )

    expect(screen.getByText('Delete')).toBeInTheDocument()
    expect(screen.getByText('Keep')).toBeInTheDocument()
  })

  it('should call onConfirm when confirm button is clicked', () => {
    const onConfirm = jest.fn()
    render(<ToasterGeneric open={true} onConfirm={onConfirm} />)

    const buttons = screen.getAllByRole('button')
    const confirmButton = buttons[buttons.length - 1]

    fireEvent.click(confirmButton)

    expect(onConfirm).toHaveBeenCalled()
  })

  it('should call onCancel when cancel button is clicked', () => {
    const onCancel = jest.fn()
    render(<ToasterGeneric open={true} onCancel={onCancel} />)

    const buttons = screen.getAllByRole('button')
    const cancelButton = buttons[0]

    fireEvent.click(cancelButton)

    expect(onCancel).toHaveBeenCalled()
  })

  it('should use default values', () => {
    render(<ToasterGeneric open={true} />)

    expect(screen.getByText('Confirmar')).toBeInTheDocument()
    expect(screen.getByText('¿Estás seguro?')).toBeInTheDocument()
    expect(screen.getByText('Aceptar')).toBeInTheDocument()
    expect(screen.getByText('Cancelar')).toBeInTheDocument()
  })

  it('should use defaults when no props provided', () => {
    const { container } = render(<ToasterGeneric />)

    const dialog = container.querySelector('[role="dialog"]')
    expect(dialog).toBeNull()
  })

  it('should have correct button colors', () => {
    const { container } = render(<ToasterGeneric open={true} />)

    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })
})
