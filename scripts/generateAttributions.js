const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const MODELS_JSON_URL = 'https://cortexishere.com/models.json';
// [MODIFIED] We now read from and write to the same file.
const ATTRIBUTIONS_FILE_PATH = path.join(__dirname, '..', 'cortex-attributions.html');
const INSERTION_POINT_START = '<!-- DYNAMIC_MODELS_INSERTION_POINT_START -->';
const INSERTION_POINT_END = '<!-- DYNAMIC_MODELS_INSERTION_POINT_END -->';

// --- HELPER FUNCTIONS ---
async function fetchModels() {
    try {
        const response = await fetch(MODELS_JSON_URL, { cache: 'no-cache' });
        if (!response.ok) {
            throw new Error(`Failed to fetch models.json: ${response.statusText}`);
        }
        console.log('Successfully fetched models.json');
        return await response.json();
    } catch (error) {
        console.error('Error fetching models:', error);
        process.exit(1);
    }
}

function filterAndSortModels(data) {
    const manualOfflineModels = [];
    if (!data || !data.producers) {
        return [];
    }
    for (const producer in data.producers) {
        for (const series in data.producers[producer]) {
            if (series === 'series_description') continue;
            for (const variant in data.producers[producer][series]) {
                if (['series_description', 'hidden'].includes(variant)) continue;
                const model = data.producers[producer][series][variant];
                if (model.source === 'manual' && model.type === 'offline' && model.licenseInfo && model.licenseInfo.licenseName) {
                    manualOfflineModels.push(model);
                }
            }
        }
    }
    return manualOfflineModels.sort((a, b) => 
        a.details.en.title.localeCompare(b.details.en.title)
    );
}

function generateHtmlForModels(models) {
    if (models.length === 0) {
        return `<p style="text-align:center; color: var(--text-secondary-color);"><i>No manually-added offline models with specific licenses are currently bundled.</i></p>`;
    }
    return models.map(model => {
        const title = model.details.en.title || 'Untitled Model';
        const { creator, licenseName, sourceName, licenseUrl } = model.licenseInfo;
        const modelUrl = model.url || '#';
        return `
    <hr class="attribution-divider">
    <div class="attribution-item">
        <h3>${title}</h3>
        <ul>
            <li><strong>Model Name:</strong> ${title}</li>
            ${creator ? `<li><strong>Creator(s):</strong> ${creator}</li>` : ''}
            ${sourceName ? `<li><strong>Source:</strong> <a href="${modelUrl}" target="_blank" rel="noopener noreferrer">${sourceName}</a></li>` : ''}
            ${licenseName && licenseUrl ? `<li><strong>License:</strong> <a href="${licenseUrl}" target="_blank" rel="noopener noreferrer">${licenseName}</a></li>` : `<li><strong>License:</strong> ${licenseName}</li>`}
        </ul>
    </div>
        `;
    }).join('\n');
}

// --- MAIN EXECUTION ---
async function main() {
    console.log('Starting attributions generation...');

    // [MODIFIED] We now use a Regex to replace content between two markers
    const modelsData = await fetchModels();
    const filteredModels = filterAndSortModels(modelsData);
    console.log(`Found ${filteredModels.length} models to attribute.`);
    
    // The HTML to be injected now includes the markers themselves.
    const generatedHtmlBlock = `${INSERTION_POINT_START}\n${generateHtmlForModels(filteredModels)}\n${INSERTION_POINT_END}`;
    
    if (!fs.existsSync(ATTRIBUTIONS_FILE_PATH)) {
        console.error(`Error: Attributions file not found at ${ATTRIBUTIONS_FILE_PATH}`);
        process.exit(1);
    }
    const currentContent = fs.readFileSync(ATTRIBUTIONS_FILE_PATH, 'utf8');

    // This regex will find the content between our start and end markers, including the markers themselves.
    const regex = new RegExp(`${INSERTION_POINT_START}[\\s\\S]*?${INSERTION_POINT_END}`, 'g');
    
    let finalHtml;
    if (regex.test(currentContent)) {
        // If markers exist, replace the content between them
        finalHtml = currentContent.replace(regex, generatedHtmlBlock);
    } else {
        // Fallback: If markers are not found (e.g., first run), do a simple replacement
        // This requires the template to have a single self-closing tag. Let's use two markers for robustness.
        console.error(`Error: Insertion points not found in the attributions file. Make sure both ${INSERTION_POINT_START} and ${INSERTION_POINT_END} exist.`);
        process.exit(1);
    }
    
    fs.writeFileSync(ATTRIBUTIONS_FILE_PATH, finalHtml, 'utf8');
    console.log(`Successfully updated ${ATTRIBUTIONS_FILE_PATH}`);
}

main();