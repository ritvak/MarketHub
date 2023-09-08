import React, { useState } from 'react';
import { Input, Button } from 'antd';
import useSimpleReactValidator from '../../helpers/useReactSimpleValidator';

const Dummy = () => {
    const [fields, setFields] = useState({
        name: '',
    });
    const [errors, setErrors] = useState({});
    const [validator, setValidator] = useSimpleReactValidator();

    const handleValidation = () => {
        console.log(validator);
        if (validator.allValid()) {
            alert('valid');
        } else {
            setErrors(validator.getErrorMessages());
            setValidator(true);
        }
    };

    return (
        <div>
            <h1 style={{ color: 'black', textAlign: 'center' }}>It works!!!</h1>

            <div>
                <Input
                    placeholder="name"
                    value={fields?.name}
                    onChange={e =>
                        setFields(prev => ({
                            ...prev,
                            name: e.target.value,
                        }))
                    }
                />
                {validator.message(`Name`, fields?.name, 'required')}
            </div>

            <Button type="primary" onClick={handleValidation}>
                Click me
            </Button>
        </div>
    );
};

export default Dummy;
