import moment from "moment";


/* eslint-disable @typescript-eslint/no-explicit-any */

export function getPropertyByPath<T>(
    obj: any,
    path: string
): { value?: T; error?: string } {
    try {
        const keys = path.split('.');
        let result: any = obj;

        for (const key of keys) {
            if (!result || typeof result !== 'object') {
                return { error: 'Invalid property path or object is null/undefined.' };
            }

            result = result[key];
        }

        return { value: result };
    } catch (error) {
        console.error(error)
        return { error: 'An error occurred while accessing the property.' };
    }
}

export function getMultiPropertyByPath<T>(
    obj: any,
    pathQuery: string
): { values?: T[]; error?: string } {
    try {
        const paths = pathQuery.split(",").map(path => path.trim());
        const values: T[] = [];

        paths.forEach(path => {
            const { value, error }: { value?: T | undefined, error?: string | undefined } = getPropertyByPath<T>(obj, path);
            if (error) {
                throw new Error(error);
            }
            values.push(value as T);
        });

        return { values: values };
    } catch (error) {
        console.error(error)
        return { error: 'An error occurred while accessing the properties.', };
    }
}

export function stripSensitiveProperties<T extends Record<string, any>, K extends keyof T>(
    object: T,
    propertiesArray: K[]
): Omit<T, K> {
    // Create a shallow copy of the object to avoid mutating the original
    const result = { ...object };

    // Loop through each property in the propertiesArray
    propertiesArray.forEach(property => {
        // If the property exists in the object, delete it
        delete result[property];
    });

    return result;
}

export function normalizePages<T>(pages?: any[]): T[] {
    return pages && pages?.length > 0
        ? pages?.reduce((prev: T[], current) => [...prev, ...current.pages], [])
        : [];
}





export type TTransformableTableData<T> = {
    data: any;
    fields: (string | ((item: T) => any))[];
    action?: (item: any) => any;
}

export const transformTableData = <T>({
    data,
    fields,
    action,
}: TTransformableTableData<T>): any[] => {

    data = data ?? [];
    // if field is button, then add button to the field

    const tableData = data.map((item: any) => {
        const row: any = [];

        fields.forEach((field: string | ((item: T) => any)) => {
            // field can come as "name" or "sub.name"
            // if field is "S/N", then it will be "S/N" in the table
            if (field === "S/N") {
                row.push(data.indexOf(item) + 1);
            }
            else if (typeof field === "function") {
                const fieldFunc = (field) as any;
                const value = fieldFunc(item);
                row.push(value);
            }
            else if (field.includes("|")) {
                field = field.replaceAll("|", ",");
                let value = "";

                value = getMultiPropertyByPath<string>(item, field).values?.join(" ") as string;

                row.push(value);
            }

            // if it includes "," then it is a list of fields
            else if (field.includes(",")) {
                const fieldArr = field.split(",");
                let value = "";
                fieldArr.forEach((f: string) => {
                    // check if it is a nested field
                    if (f.includes(".")) {
                        const nestedFieldArr = f.split(".");
                        let nestedValue = item;
                        nestedFieldArr.forEach((nf: string) => {
                            nestedValue = nestedValue[nf] ?? "N/A";
                        });
                    } else {
                        value += item[f] + " ";
                    }
                });


                row.push(value);
            } else {
                const fieldArr = field.split(".");
                let value = item;
                fieldArr.forEach((f: string) => {
                    value = value[f] ?? "N/A";
                });

                // if value is date, then format it
                if (typeof value == "number") {
                    value = String(value);
                } else if (value && value.includes("T") && value.includes("Z")) {
                    value = moment(value).format("YYYY-MM-DD");
                }

                row.push(value);
            }
        });

        if (action) {
            row.push(action(item));
        }

        return row;
    });

    return tableData;
};


export function normalizePaginated<T>(data: {
    pages: {
        msg: string;
        data: T[];
    }[];
}): T[] {
    return (data?.pages || []).flatMap((page) => page.data);
}

export const gridCols = (widthString: string): number[] => {
    const fractions = widthString.split(',').map(fraction => Number(fraction));
    const totalValue = fractions.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const percentages = fractions.map(fraction => (fraction / totalValue) * (100 / 1))
    return percentages;
};



export function shortenEmail(email: string, maxLength = 25) {
    if ((email?.length || 0) <= maxLength) return email;

    const [localPart, domain] = email.split("@");
    const [domainName, ...domainRest] = domain.split(".");

    const localPartLength = Math.ceil(maxLength * 0.4 - 3);
    const domainNameLength = Math.ceil(maxLength * 0.3 - 3);
    const domainRestLength = Math.ceil(maxLength * 0.3 - 3);

    const shortLocalPart =
        localPart.length > localPartLength
            ? localPart.slice(0, localPartLength) + "-"
            : localPart;

    const shortDomainName =
        domainName.length > domainNameLength
            ? domainName.slice(0, domainNameLength) + "-"
            : domainName;

    const shortDomainRest =
        domainRest.join(".").length > domainRestLength
            ? domainRest.join(".").slice(0, domainRestLength) + "-"
            : domainRest.join(".");

    return `${shortLocalPart}@${shortDomainName}.${shortDomainRest}`;
}