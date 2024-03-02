import React from 'react';
import "./DropdownBox.css";

interface DropdownBoxOptions {
    label: string;
    value: string;
}

interface DropdownBoxProperties {
    options: DropdownBoxOptions[];
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    defaultValue?: string;
    label?: string;
    name?: string;
}

function DropdownBox(properties: DropdownBoxProperties) {
    const { options, onChange, defaultValue, label, name } = properties;

    return (
        <div>
            {label &&
                <label className="label" htmlFor={name}>
                {label}
                </label>}<br/>
            <select
                className="select"
                name={name}
                onChange={onChange}
                defaultValue={defaultValue}>
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