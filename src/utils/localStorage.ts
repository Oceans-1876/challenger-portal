const UNIT_PREF = 'unit_pref';

export const getUnitPreferences = (): UnitPref => {
    let unitPref: UnitPref = { Temp: 'C', Depth: 'm' };
    if (localStorage.getItem(UNIT_PREF)) {
        unitPref = JSON.parse(localStorage.getItem(UNIT_PREF) as string);
    } else {
        localStorage.setItem(UNIT_PREF, JSON.stringify(unitPref));
    }

    return unitPref;
};

export const setUnitPreferences = (unitPref: UnitPref) => {
    localStorage.setItem(UNIT_PREF, JSON.stringify(unitPref));
};
