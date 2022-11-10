
const requiredValidator = value => {
    return value.trim() !== '';
};

const emailValidator = value => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(value).toLowerCase());
};

const passwordValidator = value => {
    const re=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]{8,10}$/;
    return re.test(String(value));
}

const validate = (value, rules) => {
    let isValid = true;

    for (let rule in rules) {

        switch (rule) {

            case 'isRequired': isValid = isValid && requiredValidator(value);
                               break;

            case 'emailValidator': isValid = isValid && emailValidator(value);
                                   break;
            case 'passwordValidator' : isValid = isValid && passwordValidator(value);
                break;

            default: isValid = true;
        }

    }

    return isValid;
};

export default validate;
