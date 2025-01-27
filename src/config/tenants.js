export const tenants = {
  default: {
    id: 'default',
    name: 'Default Company',
    theme: {
      primary: '#007bff',
      secondary: '#6c757d',
    },
    settings: {
      welcomeMessage: 'How can I help you today?',
      logo: '/default-logo.png',
    }
  },
  tenant1: {
    id: 'tenant1',
    name: 'Company One',
    theme: {
      primary: '#28a745',
      secondary: '#dc3545',
    },
    settings: {
      welcomeMessage: 'Welcome to Company One! How can I assist you?',
      logo: '/tenant1-logo.png',
    }
  },
  tenant2: {
    id: 'tenant2',
    name: 'Company Two',
    theme: {
      primary: '#17a2b8',
      secondary: '#ffc107',
    },
    settings: {
      welcomeMessage: 'Welcome to Company Two! How may I help you?',
      logo: '/tenant2-logo.png',
    }
  }
};

export const getTenant = (tenantId) => {
  return tenants[tenantId] || tenants.default;
};

export const getAllTenants = () => {
  return Object.values(tenants);
}; 