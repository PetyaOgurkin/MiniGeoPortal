module.exports = {
    iflvl(a, options) {
        if (+a < 2) {
            return options.inverse(this);
        }
        return options.fn(this);
    }


    
}