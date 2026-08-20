import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient.js';
import { AuthProvider } from './store/AuthContext.js';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { NotFoundPage } from './pages/NotFoundPage.js';
import { DashboardLayout } from './layouts/DashboardLayout.js';

export const App: React.FC = () => {
  const [isExternalCreateModalOpen, setIsExternalCreateModalOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Auth Routes */}
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnlyRoute>
                  <RegisterPage />
                </PublicOnlyRoute>
              }
            />

            {/* Protected Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout
                    onOpenCreateTaskModal={() => setIsExternalCreateModalOpen(true)}
                  />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={
                  <DashboardPage
                    isCreateModalOpenExternal={isExternalCreateModalOpen}
                    onCloseExternalModal={() => setIsExternalCreateModalOpen(false)}
                  />
                }
              />
            </Route>

            {/* Root & Catch-all redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
