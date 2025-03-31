'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Component bắt và hiển thị lỗi trong ứng dụng React
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Cập nhật state để hiển thị UI fallback
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log lỗi ra console
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // Hiển thị fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-400">Đã xảy ra lỗi</h2>
          <p className="mt-2 text-red-600 dark:text-red-300">
            {this.state.error?.message || 'Một lỗi không xác định đã xảy ra.'}
          </p>
          <code className="block mt-4 p-3 bg-red-100 dark:bg-red-900/40 rounded text-sm overflow-auto max-h-32">
            {this.state.error?.stack}
          </code>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;