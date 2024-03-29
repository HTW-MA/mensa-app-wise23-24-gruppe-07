import React from 'react';
import "./DropdownBox.css";

interface DropdownBoxOptions {
    label: string;
    value: string;
}

interface DropdownBoxProperties {
    options: DropdownBoxOptions[];
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    value?: string;
    label?: string;
    name?: string;
}

function DropdownBox(properties: DropdownBoxProperties) {
    const { options, onChange, value, label, name } = properties;

    return (
        <div className="dropdown-box-default">
            {label &&
                <label className="label" htmlFor={name}>
                {label}
                </label>}<br/>
            <select
                className="select"
                name={name}
                onChange={onChange}
                value={value}>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default DropdownBox;