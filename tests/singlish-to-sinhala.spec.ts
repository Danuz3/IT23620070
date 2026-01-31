import { test, expect, Page, Locator } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Test data from your Excel file - Complete with all your test cases
const testCases = [
  // Positive Functional Tests - 26 cases
  {
    id: 'Pos_Fun_0001',
    name: 'Convert polite request phrase with conditional form',
    input: 'puluvannam ikmanata gedhara enna.',
    expectedOutput: 'පුලුවන්නම් ඉක්මනට ගෙදර එන්න.',
    inputLength: 'S',
    qualityFocus: 'Accuracy validation'
  },
  {
    id: 'Pos_Fun_0002',
    name: 'Convert compound sentence with two joined actions',
    input: 'dhaen api kamu, iitapasse sellam karamu.',
    expectedOutput: 'දැන් අපි කමු, ඊටපස්සෙ සෙල්ලම් කරමු.',
    inputLength: 'M',
    qualityFocus: 'Accuracy validation'
  },
  {
    id: 'Pos_Fun_0003',
    name: 'Convert negative sentence with plural pronoun',
    input: 'apita thaama iskool patangaththe naehae.',
    expectedOutput: 'අපිට තාම ඉස්කෝල් පටන්ගත්තෙ නැහැ.',
    inputLength: 'S',
    qualityFocus: 'Accuracy validation'
  },
  {
    id: 'Pos_Fun_0004',
    name: 'Convert positive statement with emphasis',
    input: 'oyaa okkoma bath kaalaa.',
    expectedOutput: 'ඔයා ඔක්කොම බත් කාලා.',
    inputLength: 'S',
    qualityFocus: 'Accuracy validation'
  },
  {
    id: 'Pos_Fun_0005',
    name: 'Convert response with reassurance',
    input: 'eka avulak naee, mama karala dhennam',
    expectedOutput: 'එක අවුලක් නෑ, මම කරල දෙන්නම්',
    inputLength: 'S',
    qualityFocus: 'Accuracy validation'
  },
  {
    id: 'Pos_Fun_0006',
    name: 'Convert polite request with benefactive',
    input: 'karaeNaakarala oyaata puluvandha me beheth tika ammata gihin dhenna.',
    expectedOutput: 'කරැණාකරල ඔයාට පුලුවන්ද මෙ බෙහෙත් ටික අම්මට ගිහින් දෙන්න.',
    inputLength: 'M',
    qualityFocus: 'Accuracy validation'
  },
  {
    id: 'Pos_Fun_0007',
    name: 'Convert informal interrogative with invitation',
    input: 'mee ahapanko, heta kohehari yamandha?',
    expectedOutput: 'මේ අහපන්කො, හෙට කොහෙහරි යමන්ද?',
    inputLength: 'S',
    qualityFocus: 'Accuracy validation'
  },
  {
    id: 'Pos_Fun_0008',
    name: 'Convert repeated word expression for emphasis',
    input: 'hari hari aapu kaaraNaava kiyala intako.',
    expectedOutput: 'හරි හරි ආපු කාරණාව කියල ඉන්ටකො.',
    inputLength: 'S',
    qualityFocus: 'Accuracy validation'
  },
  {
    id: 'Pos_Fun_0009',
    name: 'Convert sentence with embedded English technical terms',
    input: 'sar oyaata kiyanta kivuvaa LinkedIn ekata anivaaryayen Email eka add karanna kiyalaa.',
    expectedOutput: 'සර් ඔයාට කියන්ට කිවුවා LinkedIn එකට අනිවාර්යයෙන් Email එක add කරන්න කියලා.',
    inputLength: 'M',
    qualityFocus: 'Accuracy validation'
  },
  {
    id: 'Pos_Fun_0010',
    name: 'Convert sentence with multiple English brand terms',
    input: 'mama oyaata TikTok eke thibba lassana video ekaka link ekak Whatsapp eken evuvaa.',
    expectedOutput: 'මම ඔයාට TikTok eke තිබ්බ ලස්සන video එකක link එකක් Whatsapp එකෙන් එවුවා.',
    inputLength: 'M',
    qualityFocus: 'Accuracy validation'
  },
  {
    id: 'Pos_Fun_0011',
    name: 'Convert sentence with date, time, and currency',
    input: 'pebaravaari 2 dhaval 12.00 p.m valata kalin rs.2000 k gevanta oone needha?',
    expectedOutput: 'පෙබරවාරි 2 දවල් 12.00 p.m වලට කලින් rs.2000 ක් ගෙවන්ට ඕනෙ නේද?',
    inputLength: 'M',
    qualityFocus: 'Accuracy validation'
  },
  {
    id: 'Pos_Fun_0012',
    name: 'Convert multi-line input with line breaks',
    input: 'mama heta gedhara yanta kiyala baeluve baQQ.\ngihin anidhdhaa ennaQQ aaya boodimata.',
    expectedOutput: 'මම හෙට ගෙදර යන්ට කියල බැලුවෙ බං.\nගිහින් අනිද්දා එන්නං ආය බෝඩිමට.',
    inputLength: 'M',
    qualityFocus: 'Formatting preservation'
  },
  {
    id: 'Pos_Fun_0013',
    name: 'Convert informal imperative command',
    input: 'vaedee hariyata karapQQko.',
    expectedOutput: 'වැඩේ හරියට කරපංකො.',
    inputLength: 'S',
    qualityFocus: 'Accuracy validation'
  },
  {
    id: 'Pos_Fun_0014',
    name: 'Convert long paragraph with technical terminology',
    input: 'thorathuru thaakShaNaya yanu dhaththa gabadaa kiriima, saekasiima, huvamaaru kiriima saha aarakShaa kiriima saDHAhaa parigaNaka saha sanniveedhana padhDhathi Bhaavithaa kiriimayi. mRUdhukaaQQga, dhRUdaaQQga saha antharjaalaya mehi praDhaana aQQga vee. varthamaanayee aDhYaapanaya, sauKYAya saha vYaapaarika kSheethravala dhiyuNuvata meya naethuvama baeri mevalamak vana athara, muLu lookayama ekama jaalayakata sambanDha kiriimata meya samathva aetha.',
    expectedOutput: 'තොරතුරු තාක්ෂණය යනු දත්ත ගබඩා කිරීම, සැකසීම, හුවමාරු කිරීම සහ ආරක්ෂා කිරීම සඳහා පරිගණක සහ සන්නිවේදන පද්ධති භාවිතා කිරීමයි. මෘදුකාංග, දෘඩාංග සහ අන්තර්ජාලය මෙහි ප්‍රධාන අංග වේ. වර්තමානයේ අධ්‍යාපනය, සෞඛ්‍යය සහ ව්‍යාපාරික ක්ෂේත්‍රවල දියුණුවට මෙය නැතුවම බැරි මෙවලමක් වන අතර, මුළු ලෝකයම එකම ජාලයකට සම්බන්ධ කිරීමට මෙය සමත්ව ඇත.',
    inputLength: 'L',
    qualityFocus: 'Accuracy validation'
  },
  {
    id: 'Pos_Fun_0015',
    name: 'Convert compound sentence with temporal sequence',
    input: 'dhaeQQ api nidhaagena heta udheema naegitimu gamana yanta.',
    expectedOutput: 'දැං අපි නිදාගෙන හෙට උදේම නැගිටිමු ගමන යන්ට.',
    inputLength: 'S',
    qualityFocus: 'Accuracy validation'
  },
  {
    id: 'Pos_Fun_0016',
    name: 'Convert interrogative with progressive aspect',
    input: 'oyaa hodhiQQ vaeda tika karagena yanavadha?.',
    expectedOutput: 'ඔයා හොදිං වැඩ ටික කරගෙන යනවද?.',
    inputLength: 'S',
    qualityFocus: 'Accuracy validation'
  },
  {
    id: 'Pos_Fun_0017',
    name: 'Convert polite request with benefactive construction',
    input: 'oyaata puluvandha adha mQQ venuveQQ nivaaduvak ganna?',
    expectedOutput: 'ඔයාට පුලුවන්ද අද මං වෙනුවෙං නිවාඩුවක් ගන්න?',
    inputLength: 'M',
    qualityFocus: 'Accuracy validation'
  },
  {
    id: 'Pos_Fun_0018',
    name: 'Convert response with agreement and condition',
    input: 'ov, ehema kiyapu ekath hodhayi haebaeyi.',
    expectedOutput: 'ඔව්, එහෙම කියපු එකත් හොදයි හැබැයි.',
    inputLength: 'S',
    qualityFocus: 'Accuracy validation'
  },
  {
    id: 'Pos_Fun_0019',
    name: 'Convert expression of tiredness with postponement',
    input: 'mata dhaeQQ mahansiyi heta kathaakaramu.',
    expectedOutput: 'මට දැං මහන්සියි හෙට කතාකරමු.',
    inputLength: 'S',
    qualityFocus: 'Accuracy validation'
  },
  {
    id: 'Pos_Fun_0020',
    name: 'Convert negative identity statement',
    input: 'mama ehema kenek nemee.',
    expectedOutput: 'මම එහෙම කෙනෙක් නෙමේ.',
    inputLength: 'S',
    qualityFocus: 'Accuracy validation'
  },
  {
    id: 'Pos_Fun_0021',
    name: 'Convert question with plural pronoun',
    input: 'oyaala heta uthsaveeta enavadha?',
    expectedOutput: 'ඔයාල හෙට උත්සවේට එනවද?',
    inputLength: 'S',
    qualityFocus: 'Accuracy validation'
  },
  {
    id: 'Pos_Fun_0022',
    name: 'Convert sentence with excessive spacing',
    input: 'heta thiyana   paadama     amaaruyi, eeka hindhaa anivaareQQ panthi yanta       oone.',
    expectedOutput: 'හෙට තියන   පාඩම     අමාරුයි, ඒක හින්දා අනිවාරෙං පන්ති යන්ට       ඕනෙ.',
    inputLength: 'M',
    qualityFocus: 'Robustness validation'
  },
  {
    id: 'Pos_Fun_0023',
    name: 'Convert sentence with units of measurement',
    input: 'sar kivuvaa heta enakota liitar 1 k kiyanne ml kiiyakdha, miitar 1 k kiyanne cm kiiyakdha, graeem kiiyakiQQdha kg ekak saeedhenne kiyaa hoyaana enna kiyala.',
    expectedOutput: 'සර් කිවුවා හෙට එනකොට ලීටර් 1 ක් කියන්නෙ ml කීයක්ද, මීටර් 1 ක් කියන්නෙ cm කීයක්ද, ග්‍රෑම් කීයකිංද kg එකක් සෑදෙන්නෙ කියා හොයාන එන්න කියල.',
    inputLength: 'M',
    qualityFocus: 'Accuracy validation'
  },
  {
    id: 'Pos_Fun_0024',
    name: 'Convert colloquial slang expression',
    input: 'adoo siraadha!! uu aluth bayik ekak arQQdha?.',
    expectedOutput: 'අඩෝ සිරාද!! ඌ අලුත් බයික් එකක් අරංද?',
    inputLength: 'M',
    qualityFocus: 'Accuracy validation'
  },
  {
    id: 'Pos_Fun_0025',
    name: 'Convert sentence with parenthetical information',
    input: 'meekata anuvaa "dhitvaa"(suli kuNaatuva) kiyanne lQQkaavata 2004 dhi aapu sunaamiyatath vadaa viyasanayak needha?',
    expectedOutput: 'මේකට අනුවා "දිට්වා"(සුලි කුණාටුව) කියන්නෙ ලංකාවට 2004 දි ආපු සුනාමියටත් වඩා වියසනයක් නේද?',
    inputLength: 'M',
    qualityFocus: 'Accuracy validation'
  },
  {
    id: 'Pos_Fun_0026',
    name: 'Convert normal vs joined word variations',
    input: 'mama vaahanaya hoodhannam. | mamavaahanayahoodhannam.',
    expectedOutput: 'මම වාහනය හෝදන්නම්. | මමවාහනයහෝදන්නම්.',
    inputLength: 'S',
    qualityFocus: 'Robustness validation'
  },
  // Negative Functional Tests - 10 cases
  {
    id: 'Neg_Fun_0001',
    name: 'Incorrectly converts double vowel repetition',
    input: 'mama adha maNYANYAokkaa hadhantadha?',
    expectedOutput: 'මම අද මඤ්ඤොක්කා හදන්ටද?',
    inputLength: 'S',
    qualityFocus: 'Robustness validation',
    isNegative: true
  },
  {
    id: 'Neg_Fun_0002',
    name: 'Fails to convert English word embedded in Singlish',
    input: 'pereedhaa ape gedhetta naeeyo aavaa.',
    expectedOutput: 'පෙරේදා අපෙ ගෙදෙට්ට නෑයො ආවා.',
    inputLength: 'M',
    qualityFocus: 'Robustness validation',
    isNegative: true
  },
  {
    id: 'Neg_Fun_0003',
    name: 'Incorrectly converts abbreviations in mixed content',
    input: 'e machan mee, mama PC ekak built karaa. Performance nam patta CPU eka i7 14th gen, GPU eka rtx 5090 ti, RAM eka 64 GB baQQ.',
    expectedOutput: 'එ මචන් මේ, මම PC එකක් built කරා. Performance නම් පට්ට CPU එක i7 14th gen, GPU එක rtx 5090 ti, RAM එක 64 GB බං.',
    inputLength: 'M',
    qualityFocus: 'Robustness validation',
    isNegative: true
  },
  {
    id: 'Neg_Fun_0004',
    name: 'Fails to preserve standalone Sinhala letter',
    input: 'siQQhala maedam kivuvaa heta enakota 2022 paper ekee 4 veni prashne (a) kotasayi (aa) kotasayi karan enna kiyalaa.',
    expectedOutput: 'සිංහල මැඩම් කිවුවා හෙට එනකොට 2022 paper එකේ 4 වෙනි ප්‍රශ්නෙ (අ) කොටසයි (ආ) කොටසයි කරන් එන්න කියලා.',
    inputLength: 'M',
    qualityFocus: 'Robustness validation',
    isNegative: true
  },
  {
    id: 'Neg_Fun_0005',
    name: 'Character swapping causes incorrect word formation',
    input: 'mata oone kaarYA⁠kShamathaavaya manina eekakaya dhaenaganta.',
    expectedOutput: 'මට ඕනෙ කාර්යක්ෂමතාවය මනින ඒකකය දැනගන්ට.',
    inputLength: 'M',
    qualityFocus: 'Robustness validation',
    isNegative: true
  },
  {
    id: 'Neg_Fun_0006',
    name: 'Repeated word with slight typo fails conversion',
    input: 'chuttak chuttak vada puluvan.',
    expectedOutput: 'චුට්ටක් චුට්ටක් වැඩ පුලුවන්.',
    inputLength: 'S',
    qualityFocus: 'Robustness validation',
    isNegative: true
  },
  {
    id: 'Neg_Fun_0007',
    name: 'Verb conjugation produces incomplete form',
    input: 'api heta enava malli.',
    expectedOutput: 'අපි හෙට එනවා මල්ලි.',
    inputLength: 'S',
    qualityFocus: 'Robustness validation',
    isNegative: true
  },
  {
    id: 'Neg_Fun_0008',
    name: 'Demonstrative pronoun has vowel error',
    input: 'oke thiyana dhee mata kiyanna.',
    expectedOutput: 'ඔකෙ තියන දේ මට කියන්න.',
    inputLength: 'S',
    qualityFocus: 'Robustness validation',
    isNegative: true
  },
  {
    id: 'Neg_Fun_0009',
    name: 'Adjective form with wrong vowel length',
    input: 'ooke eLiya godak vadi needha?',
    expectedOutput: 'ඔකෙ එළිය ගොඩක් වඩි නේද?',
    inputLength: 'S',
    qualityFocus: 'Robustness validation',
    isNegative: true
  },
  {
    id: 'Neg_Fun_0010',
    name: 'Word with double consonant has missing character',
    input: 'akka iiye vaedata giye naee.',
    expectedOutput: 'අක්කා ඊයෙ වැඩට ගියෙ නෑ.',
    inputLength: 'S',
    qualityFocus: 'Robustness validation',
    isNegative: true
  },
  // UI Tests - 1 Positive UI (from your Excel)
  {
    id: 'Pos_UI_0001',
    name: 'Clear button removes text from both input fields',
    input: 'mama gedhara yanavaa',
    expectedOutput: 'මම ගෙදර යනවා',
    inputLength: 'S',
    qualityFocus: 'Real-time output update behavior',
    isUITest: true
  }
];

// Create results directory if it doesn't exist
const resultsDir = path.join(process.cwd(), 'test-results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

// Type definitions for test results
interface TestResult {
  passed: boolean;
  actualOutput: string;
  matchType?: string;
  error?: string;
  isNegative?: boolean;
  uiTest?: boolean;
  shouldPass?: boolean;
}

// Helper function to run a single test case
async function runTestCase(page: Page, testCase: any): Promise<TestResult> {
  console.log(`Starting test: ${testCase.id} - ${testCase.name}`);
  
  try {
    // 1. Navigate to the Swift Translator website
    console.log(`Navigating to https://www.swifttranslator.com/`);
    await page.goto('https://www.swifttranslator.com/', { waitUntil: 'domcontentloaded', timeout: 15000 });
    
    // Wait for page to load completely
    await page.waitForLoadState('domcontentloaded');
    
    // Give the page time to fully initialize
    await page.waitForTimeout(2000);
    
    // 2. Look for the main translation container
    console.log('Looking for translation interface...');
    
    // First, try to find the main translation container
    const translationContainer = page.locator('div').filter({ hasText: /singlish|sinhala|translate|translation/i }).first();
    
    if (await translationContainer.count() > 0) {
      console.log('Found translation container');
    }
    
    // 3. Try different strategies to find the input field
    let singlishInput: Locator | null = null;
    
    // Strategy 1: Look for textareas
    const textareas = page.locator('textarea');
    const textareaCount = await textareas.count();
    console.log(`Found ${textareaCount} textareas`);
    
    for (let i = 0; i < textareaCount; i++) {
      const textarea = textareas.nth(i);
      const placeholder = await textarea.getAttribute('placeholder') || '';
      const id = await textarea.getAttribute('id') || '';
      const className = await textarea.getAttribute('class') || '';
      
      if (placeholder.toLowerCase().includes('singlish') || 
          placeholder.toLowerCase().includes('enter') ||
          placeholder.toLowerCase().includes('type') ||
          id.toLowerCase().includes('input') ||
          className.toLowerCase().includes('input')) {
        singlishInput = textarea;
        console.log(`Found input textarea with placeholder: "${placeholder}"`);
        break;
      }
    }
    
    // Strategy 2: Look for contenteditable divs
    if (!singlishInput) {
      const contentEditable = page.locator('[contenteditable="true"]');
      const editableCount = await contentEditable.count();
      console.log(`Found ${editableCount} contenteditable elements`);
      
      if (editableCount > 0) {
        singlishInput = contentEditable.first();
        console.log('Using first contenteditable element');
      }
    }
    
    // Strategy 3: Look for input fields
    if (!singlishInput) {
      const inputs = page.locator('input[type="text"]');
      const inputCount = await inputs.count();
      console.log(`Found ${inputCount} text inputs`);
      
      if (inputCount > 0) {
        singlishInput = inputs.first();
        console.log('Using first text input');
      }
    }
    
    // Strategy 4: Fallback - use the first textarea or contenteditable
    if (!singlishInput && textareaCount > 0) {
      singlishInput = textareas.first();
      console.log('Using first textarea as fallback');
    }
    
    if (!singlishInput) {
      throw new Error('Could not find Singlish input field on the page');
    }
    
    // Clear the input field
    await singlishInput.click({ clickCount: 3 });
    await singlishInput.press('Backspace');
    await page.waitForTimeout(500);
    
    if (testCase.isUITest) {
      // For UI test: Test clear button functionality
      await singlishInput.fill(testCase.input);
      console.log(`Entered input: "${testCase.input}"`);
      
      // Wait for conversion
      await page.waitForTimeout(2000);
      
      // Look for clear button
      const clearButton = page.locator('button').filter({ hasText: /clear|reset/i }).first();
      
      if (await clearButton.count() > 0) {
        await clearButton.click();
        console.log('Clicked clear button');
        
        // Check if input is cleared
        await page.waitForTimeout(1000);
        const inputValue = await singlishInput.inputValue() || '';
        const actualOutput = inputValue.trim();
        
        return { 
          passed: actualOutput === '', 
          actualOutput: actualOutput,
          uiTest: true,
          shouldPass: true
        };
      } else {
        throw new Error('Clear button not found');
      }
    } else {
      // For functional tests: Enter text and get output
      console.log(`Entering text: "${testCase.input}"`);
      await singlishInput.fill(testCase.input);
      
      // Wait for conversion
      if (testCase.inputLength === 'L') {
        await page.waitForTimeout(4000);
      } else {
        await page.waitForTimeout(2500);
      }
      
      // 4. Find the output field
      let sinhalaOutput: Locator | null = null;
      let actualOutput = '';
      
      // Strategy 1: Look for output textareas
      const outputTextareas = page.locator('textarea').filter({ 
        has: page.locator('[readonly]') 
      }).or(page.locator('textarea[readonly]'));
      
      const outputTextareaCount = await outputTextareas.count();
      console.log(`Found ${outputTextareaCount} output textareas`);
      
      if (outputTextareaCount > 0) {
        sinhalaOutput = outputTextareas.first();
        actualOutput = await sinhalaOutput.inputValue() || '';
        console.log(`Got output from textarea: "${actualOutput.substring(0, 50)}..."`);
      }
      
      // Strategy 2: Look for divs with Sinhala text
      if (!actualOutput || actualOutput.trim().length === 0) {
        console.log('Looking for Sinhala text in divs...');
        
        // Get all text content and look for Sinhala characters
        const bodyText = await page.textContent('body') || '';
        const sinhalaRegex = /[\u0D80-\u0DFF][\u0D80-\u0DFF\s\.,!?\:\;\-\|\"\'\(\)]*[\u0D80-\u0DFF]/g;
        const matches = bodyText.match(sinhalaRegex);
        
        if (matches && matches.length > 0) {
          // Find the longest Sinhala text that's not just a character table
          const validMatches = matches.filter(m => !m.includes('අආඇඈඉඊඋඌඍඎඏඐඑඒඓඔඕඖකඛගඝඞඟචඡජඣඤටඨඩඪණඬතථදධනඳපඵබභමඹයරලවශෂසහෆළ'));
          
          if (validMatches.length > 0) {
            validMatches.sort((a, b) => b.length - a.length);
            actualOutput = validMatches[0].trim();
            console.log(`Extracted Sinhala text from page: "${actualOutput.substring(0, 50)}..."`);
          } else if (matches.length > 0) {
            // If all matches are character tables, use the first one
            actualOutput = matches[0].trim();
            console.log(`Using character table as output: "${actualOutput.substring(0, 50)}..."`);
          }
        }
      }
      
      // Strategy 3: Look for specific output containers
      if (!actualOutput || actualOutput.trim().length === 0) {
        console.log('Looking for output containers...');
        
        const outputContainers = page.locator('div, pre, code').filter({ 
          hasText: /[\u0D80-\u0DFF]/ 
        });
        
        const containerCount = await outputContainers.count();
        console.log(`Found ${containerCount} containers with Sinhala text`);
        
        for (let i = 0; i < containerCount; i++) {
          const container = outputContainers.nth(i);
          const text = await container.textContent() || '';
          
          // Skip if it's just a character table
          if (!text.includes('අආඇඈඉඊඋඌඍඎඏඐඑඒඓඔඕඖකඛගඝඞඟචඡජඣඤටඨඩඪණඬතථදධනඳපඵබභමඹයරලවශෂසහෆළ')) {
            actualOutput = text.trim();
            console.log(`Found output in container: "${actualOutput.substring(0, 50)}..."`);
            break;
          }
        }
      }
      
      // Clean up the actual output
      actualOutput = actualOutput.trim();
      
      // If we got a character table, the translation probably failed
      if (actualOutput.includes('අආඇඈඉඊඋඌඍඎඏඐඑඒඓඔඕඖකඛගඝඞඟචඡජඣඤටඨඩඪණඬතථදධනඳපඵබභමඹයරලවශෂසහෆළ')) {
        console.log('Got character table instead of translation');
        // Try to get any other Sinhala text on the page
        const allText = await page.textContent('body') || '';
        const lines = allText.split('\n').filter(line => {
          const sinhalaChars = line.match(/[\u0D80-\u0DFF]/g);
          return sinhalaChars && sinhalaChars.length > 2 && 
                 !line.includes('අආඇඈඉඊඋඌඍඎඏඐඑඒඓඔඕඖකඛගඝඞඟචඡජඣඤටඨඩඪණඬතථදධනඳපඵබභමඹයරලවශෂසහෆළ');
        });
        
        if (lines.length > 0) {
          actualOutput = lines[0].trim();
          console.log(`Found alternative output: "${actualOutput}"`);
        }
      }
      
      console.log(`Actual output: "${actualOutput}"`);
      
      // 5. Compare with expected output
      const normalizedActual = actualOutput.replace(/\s+/g, ' ').trim();
      const normalizedExpected = testCase.expectedOutput.replace(/\s+/g, ' ').trim();
      
      let passed = false;
      let matchType = 'none';
      let shouldPass = !testCase.isNegative;
      
      if (testCase.isNegative) {
        // For negative tests: we expect them NOT to match
        if (normalizedActual !== normalizedExpected) {
          passed = true; // Negative test passed because it didn't match (as expected)
          matchType = 'negative-expected-mismatch';
          shouldPass = false;
        } else {
          passed = false; // Negative test failed because it matched (unexpected)
          matchType = 'negative-unexpected-match';
          shouldPass = true;
        }
      } else {
        // For positive tests
        if (normalizedActual === normalizedExpected) {
          passed = true;
          matchType = 'exact';
          shouldPass = true;
        } else if (normalizedActual.includes(normalizedExpected)) {
          passed = true;
          matchType = 'subset';
          shouldPass = true;
        } else if (normalizedExpected.includes(normalizedActual) && normalizedActual.length > 5) {
          passed = true;
          matchType = 'superset';
          shouldPass = true;
        } else {
          // Try partial match for longer texts
          const actualWords = normalizedActual.split(/\s+/).filter(w => w.length > 0);
          const expectedWords = normalizedExpected.split(/\s+/).filter(w => w.length > 0);
          
          const commonWords = actualWords.filter(word => expectedWords.includes(word));
          const matchPercentage = expectedWords.length > 0 ? (commonWords.length / expectedWords.length) * 100 : 0;
          
          if (matchPercentage > 70) {
            passed = true;
            matchType = `partial-${matchPercentage.toFixed(0)}%`;
            shouldPass = true;
          } else {
            passed = false;
            matchType = 'mismatch';
            shouldPass = true;
          }
        }
      }
      
      console.log(`Match type: ${matchType}`);
      console.log(passed ? 'TEST PASSED' : 'TEST FAILED');
      
      return { 
        passed, 
        actualOutput, 
        matchType,
        isNegative: testCase.isNegative,
        shouldPass
      };
    }
    
  } catch (error) {
    console.log(`Test ${testCase.id} failed with error:`, error instanceof Error ? error.message : 'Unknown error');
    return { 
      passed: false, 
      actualOutput: '', 
      error: error instanceof Error ? error.message : 'Unknown error',
      matchType: 'error',
      isNegative: testCase.isNegative,
      shouldPass: !testCase.isNegative
    };
  }
}

// Run each test case in its own test context
for (const testCase of testCases) {
  test(`${testCase.id} - ${testCase.name}`, async ({ page }) => {
    console.log(`\n=== Starting test ${testCase.id}: ${testCase.name} ===`);
    
    const result = await runTestCase(page, testCase);
    
    // Determine the correct assertion based on test type
    if (testCase.isNegative) {
      // Negative test: should PASS if output doesn't match expected (system failed as expected)
      if (result.passed) {
        console.log(`NEGATIVE TEST PASSED: System failed to convert as expected`);
        // Negative test passed = good, so we don't throw error
      } else {
        // Negative test failed = system worked when it shouldn't have
        console.log(`NEGATIVE TEST FAILED: System converted correctly when it should have failed`);
        throw new Error(`Negative test ${testCase.id} failed: System worked when it should have failed. Expected mismatch but got: "${result.actualOutput}"`);
      }
    } else if (testCase.isUITest) {
      // UI test: should pass if UI function worked
      if (!result.passed) {
        throw new Error(`UI test ${testCase.id} failed: ${result.error || 'UI function did not work as expected'}`);
      }
    } else {
      // Positive test: should pass if conversion is correct
      if (!result.passed) {
        throw new Error(`Positive test ${testCase.id} failed. Expected: "${testCase.expectedOutput}", Got: "${result.actualOutput}" (Match: ${result.matchType})`);
      }
    }
    
    console.log(`=== Completed test ${testCase.id} ===\n`);
  });
}