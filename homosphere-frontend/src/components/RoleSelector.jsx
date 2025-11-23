import React from 'react';
import { COLORS } from '../constants/colors';

const RoleSelector = ({ selectedRole, onChange }) => {
  const roles = ['Buyer', 'Seller', 'Broker'];

  const handleRoleClick = (role) => {
    onChange({ target: { name: 'role', value: role } });
  };

  return (
    <div className="role-selection-container">
      {roles.map((role) => (
        <button
          key={role}
          type="button"
          onClick={() => handleRoleClick(role)}
          className={`role-button ${selectedRole === role ? 'active' : ''} ${selectedRole === "" ? 'role-invalid' : 'role-valid'}`}
          style={{ borderColor: selectedRole === "" ? COLORS.DARK_RED : COLORS.JUNGLE_GREEN }} 
        >
          {role}
        </button>
      ))}
    </div>
  );
};

export default RoleSelector;
