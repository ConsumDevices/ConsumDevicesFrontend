//aparent sunt constante

const minLengthValidator = (value, minLength) => {
    return value.length >= minLength;
};

const requiredValidator = value => {
    return value.trim() !== '';
};

const validate = (value, rules) => {
    let isValid = true;

    for (let rule in rules) {

        //cele 3 de mai sus, verificam ce trebuie
        switch (rule) {
            case 'minLength': isValid = isValid && minLengthValidator(value, rules[rule]);
                              break;

            case 'isRequired': isValid = isValid && requiredValidator(value);
                               break;

            default: isValid = true;
        }

    }

    return isValid;
};

//numai la validate dai export, doar asta folosesti altundeva?
export default validate;