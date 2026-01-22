export function isJSONok(jsonFile: JSON): boolean {
    /**
     * Function checks if returned JSON has expected attributes and structure.
     *
     * @params {string} jsonFile - input file
    */

    if (typeof jsonFile !== 'object' || jsonFile === null) return false;

    // Validate top-level string properties
    const requiredTopLevelStrings = [
        'schema_version',
        'generated_at',
        'last_modified'
    ];

    for (var j = 0; j < requiredTopLevelStrings.length; j++) {
        if (requiredTopLevelStrings[j] !== jsonFile)
    }

    // Validate result object
    if (typeof jsonFile.result !== 'object' || jsonFile.result === null) return false;

    const result = jsonFile.result;

    // Validate result object properties
    const requiredResultStrings = [
        'name',
        'label',
        'category',
        'versionCommand'
    ];

    for (const prop of requiredResultStrings) {
        if (typeof result[prop] !== 'string') return false;
    }

    // Validate arrays
    const requiredArrays = ['aliases', 'tags', 'identifiers'];
    for (const prop of requiredArrays) {
    if (!Array.isArray(result[prop])) return false;
    }

    // Validate identifiers structure
    if (!result.identifiers.every(id =>
        typeof id === 'object' &&
        id !== null &&
        typeof id.type === 'string' &&
        typeof id.id === 'string'
    )) return false;

    // Validate labels object
    if (typeof result.labels !== 'object' || result.labels === null) return false;

    // Validate links object
    if (typeof result.links !== 'object' || result.links === null) return false;

    // Validate releases array
    if (!Array.isArray(result.releases)) return false;

    // Validate each release
    const requiredReleaseProps = [
        'name', 'label', 'releaseDate', 'isLts',
        'isEol', 'isMaintained'
    ];

    for (const release of result.releases) {
        // Check basic release structure
        for (const prop of requiredReleaseProps) {
            if (typeof release[prop] === 'undefined') return false;
        }

        // Validate latest release if exists
        if (release.latest) {
            if (typeof release.latest !== 'object' || release.latest === null) return false;
            const requiredLatestProps = ['name', 'date', 'link'];
            for (const prop of requiredLatestProps) {
                if (typeof release.latest[prop] !== 'string') return false;
            }
        }
    }

    return true;
}
