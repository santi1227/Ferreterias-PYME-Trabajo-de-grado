import { render, screen } from '@testing-library/react';
import LoadingOverlay from '@/app/components/others/LoadingOverlay';

jest.mock('@mui/material', () => ({
  Backdrop: ({ children, open, ...props }) =>
    open ? <div data-testid="backdrop" {...props}>{children}</div> : null,
  CircularProgress: () => <div data-testid="circular-progress" />,
}));

describe('LoadingOverlay Component', () => {
  it('should render when loading is true', () => {
    render(<LoadingOverlay loading={true} />);
    expect(screen.getByTestId('backdrop')).toBeInTheDocument();
    expect(screen.getByTestId('circular-progress')).toBeInTheDocument();
  });

  it('should not render when loading is false', () => {
    render(<LoadingOverlay loading={false} />);
    expect(screen.queryByTestId('backdrop')).not.toBeInTheDocument();
  });

  it('should default to loading=false', () => {
    render(<LoadingOverlay />);
    expect(screen.queryByTestId('backdrop')).not.toBeInTheDocument();
  });

  it('should render CircularProgress when open', () => {
    render(<LoadingOverlay loading={true} />);
    expect(screen.getByTestId('circular-progress')).toBeInTheDocument();
  });
});
