import Cookies from 'universal-cookie';

const cookie = new Cookies();

export const getUnitPreferences = (): UnitPref => {
    // const cookie = new Cookies();
    let unitPref: UnitPref = { Temp: 'C', Depth: 'ft' };
    if (cookie.get(UNIT_PREF)) {
        unitPref = cookie.get(UNIT_PREF);
    } else {
        cookie.set(UNIT_PREF, { Temp: 'C', Depth: 'ft' } as UnitPref, { path: '/' });
    }
    return unitPref;
};

export const setUnitPreferences = (unitPref: UnitPref) => {
    cookie.set(UNIT_PREF, unitPref, { path: '/' });
};

// Utility functions, not yet used.
export const removeUnitPref = () => {
    cookie.remove(UNIT_PREF);
};
