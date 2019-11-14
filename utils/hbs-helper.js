module.exports = {
    ifEditLvl(a, options) {
        if (+a < 2) {
            return options.inverse(this);
        }
        return options.fn(this);
    },
    ifAdmin(a, options) {
        if (+a === 3) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    select(selected, options) {
        return options.fn(this).replace(
            new RegExp(' value=\"' + selected + '\"'),
            '$& selected="selected"');
    }
}