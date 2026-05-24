'use client';

// Browser-compatible auth actions for Storybook
export const signIn = async () => {
  if (typeof window !== 'undefined') {
    console.log('Mock signIn called in browser environment');
    // You could redirect to a mock login page or show an alert
    alert('Mock sign in triggered');
  }
};

export const signOut = async () => {
  if (typeof window !== 'undefined') {
    console.log('Mock signOut called in browser environment');
    // You could redirect to a mock logout page or show an alert
    alert('Mock sign out triggered');
  }
};