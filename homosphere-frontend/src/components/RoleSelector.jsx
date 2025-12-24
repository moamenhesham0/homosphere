import React, { useEffect } from 'react';
import { COLORS } from '../constants/colors';
import { fetchSignUpRoles } from '@services/roles.js';

const RoleSelector = ({ selectedRole, onChange }) => {
    const [roles, setRoles] = React.useState([]);

    useEffect(() => {
        fetchSignUpRoles()
            .then(setRoles)
            .catch((error) => setRoles([]));
    }, []);

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
                    className={`role-button ${selectedRole === role ? 'active' : ''} ${selectedRole === '' ? 'role-invalid' : 'role-valid'}`}
                    style={{
                        borderColor: selectedRole === '' ? COLORS.DARK_RED : COLORS.JUNGLE_GREEN,
                    }}
                >
                    {role}
                </button>
            ))}
        </div>
    );
};

export default RoleSelector;
