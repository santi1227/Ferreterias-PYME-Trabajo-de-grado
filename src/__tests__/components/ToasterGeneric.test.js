import { render, screen, fireEvent } from '@testing-library/react';
import ToasterGeneric from '@/app/components/others/ToasterGeneric';

jest.mock('@mui/material', () => ({
  Dialog: ({ children, open, ...props }) => open ? <div data-testid="dialog" {...props}>{children}</div> : null,
  DialogTitle: ({ children }) => <div data-testid="dialog-title">{children}</div>,
  DialogContent: ({ children }) => <div data-testid="dialog-content">{children}</div>,
  DialogContentText: ({ children }) => <div data-testid="dialog-text">{children}</div>,
  DialogActions: ({ children }) => <div data-testid="dialog-actions">{children}</div>,
  Button: ({ children, onClick, variant, color, ...props }) => (
    <button data-testid={`button-${color || 'default'}`} onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

describe('ToasterGeneric Component', () => {
  it('should render when open is true', () => {
    render(<ToasterGeneric open={true} />);
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
  });

  it('should not render when open is false', () => {
    render(<ToasterGeneric open={false} />);
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('should display custom title', () => {
    render(<ToasterGeneric open={true} title="Delete Item?" />);
    expect(screen.getByText('Delete Item?')).toBeInTheDocument();
  });

  it('should display custom message', () => {
    render(<ToasterGeneric open={true} message="Are you sure?" />);
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('should display custom button text', () => {
    render(
      <ToasterGeneric
        open={true}
        confirmText="Delete"
        cancelText="Keep"
      />
    );
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Keep')).toBeInTheDocument();
  });

  it('should call onConfirm when confirm button is clicked', () => {
    const onConfirm = jest.fn();
    render(<ToasterGeneric open={true} onConfirm={onConfirm} />);

    const confirmButton = screen.getByTestId('button-error');
    fireEvent.click(confirmButton);

    expect(onConfirm).toHaveBeenCalled();
  });

  it('should call onCancel when cancel button is clicked', () => {
    const onCancel = jest.fn();
    render(<ToasterGeneric open={true} onCancel={onCancel} />);

    const cancelButton = screen.getByTestId('button-default');
    fireEvent.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });

  it('should use default values', () => {
    render(<ToasterGeneric open={true} />);
    expect(screen.getByText('Confirmar')).toBeInTheDocument();
    expect(screen.getByText('¿Estás seguro?')).toBeInTheDocument();
    expect(screen.getByText('Aceptar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('should not render when open is undefined (defaults to false)', () => {
    render(<ToasterGeneric />);
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });
});
