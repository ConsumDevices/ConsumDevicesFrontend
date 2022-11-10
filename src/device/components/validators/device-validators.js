//aparent sunt constante
const minLengthValidator = (value, minLength) => {
    return value.length >= minLength;
};

const requiredValidator = value => {
    return value.trim() !== '';
};

const maxHourlyConsumptionValidator = value => {
    //return Math.abs(value - 0.0) < Number.EPSILON;
    return value>0;
}

const validate = (value, rules) => {
    let isValid = true;

    for (let rule in rules) {
        switch (rule) {
            case 'minLength': isValid = isValid && minLengthValidator(value, rules[rule]);
                              break;

            case 'isRequired': isValid = isValid && requiredValidator(value);
                               break;
            case 'maxHourlyConsumptionValidator': isValid = isValid && maxHourlyConsumptionValidator(value);
                break;

            default: isValid = true;
        }

    }

    return isValid;
};

//numai la validate dai export, doar asta folosesti altundeva?
export default validate;
