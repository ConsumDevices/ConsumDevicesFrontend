//aparent sunt constante
/*
const minLengthValidator = (value, minLength) => {
    return value.length >= minLength;
};

const requiredValidator = value => {
    return value.trim() !== '';
};

//regex pentru email
const emailValidator = value => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(value).toLowerCase());
};

const nameValidator = value => {
    const re = /^[A-Z][a-z,.'-]+ [A-Z][a-z,.'-]+$/;
    return re.test(String(value));
}

const ageValidator = value => {
    return (value>=18 && value<=100);
}

const passwordValidator = value => {
    const re=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]{8,10}$/;
    return re.test(String(value));
}

const roleValidator = value => {
    return (value.localeCompare("admin") || value.localeCompare("Admin") || value.localeCompare("client") || value.localeCompare("Client"));
}

const validate = (value, rules) => {
    let isValid = true;

    for (let rule in rules) {

        //cele 3 de mai sus, verificam ce trebuie
        switch (rule) {
            case 'minLength': isValid = isValid && minLengthValidator(value, rules[rule]);
                              break;

            case 'isRequired': isValid = isValid && requiredValidator(value);
                               break;

            case 'emailValidator': isValid = isValid && emailValidator(value);
                                   break;
            case 'nameValidator' : isValid = isValid && nameValidator(value);
                                break;
            case 'ageValidator' : isValid = isValid && ageValidator(value);
                break;
            case 'passwordValidator' : isValid = isValid && passwordValidator(value);
                break;
            case 'roleValidator' : isValid = isValid && roleValidator(value);
                break;

            default: isValid = true;
        }

    }

    return isValid;
};

//numai la validate dai export, doar asta folosesti altundeva?
export default validate;
*/