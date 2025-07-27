import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('React ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRefresh = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2 className="error-title">Something went wrong</h2>
          <p className="error-message">
            An error occurred in the application. This could be due to a network issue or an internal problem.
          </p>
          <button className="error-action" onClick={this.handleRefresh}>
            Refresh Page
          </button>
          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <details className="error-details">
              <summary>Error Details</summary>
              <pre>{this.state.error.toString()}</pre>
              <pre>{this.state.errorInfo?.componentStack}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
