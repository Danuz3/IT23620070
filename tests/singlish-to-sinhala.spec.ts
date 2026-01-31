import { test, expect } from '@playwright/test';
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

// Helper function to run a single test case
async function runTestCase(page: any, testCase: any) {
  console.log(`🚀 Starting test: ${testCase.id} - ${testCase.name}`);
  
  try {
    // 1. Navigate to the Swift Translator website
    await page.goto('https://www.swifttranslator.com/');
    console.log('✓ Navigated to https://www.swifttranslator.com/');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // 2. Locate the Singlish input field (using more specific selectors)
    const inputSelectors = [
      'input[type="text"]',
      'textarea',
      '[placeholder*="Singlish"]',
      '[placeholder*="Enter"]',
      '[placeholder*="Type"]',
      '#singlish-input',
      '.singlish-input',
      '[id*="input"]',
      '[class*="input"]',
      'input',
      '[contenteditable="true"]'
    ];
    
    let singlishInput = null;
    for (const selector of inputSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      
      for (let i = 0; i < count; i++) {
        const element = elements.nth(i);
        if (await element.isVisible()) {
          singlishInput = element;
          console.log(`✓ Found input field with selector: ${selector} [index: ${i}]`);
          break;
        }
      }
      if (singlishInput) break;
    }
    
    if (!singlishInput) {
      throw new Error('Could not find Singlish input field');
    }
    
    // 3. Clear and enter the Singlish text
    await singlishInput.click({ clickCount: 3 }); // Select all
    await singlishInput.press('Backspace');
    
    if (testCase.isUITest) {
      // For UI test: Test clear button functionality
      await singlishInput.fill(testCase.input);
      console.log(`✓ Entered input: "${testCase.input}"`);
      
      // Wait for conversion
      await page.waitForTimeout(1500);
      
      // Find and click clear button
      const clearButtonSelectors = [
        'button:has-text("Clear")',
        'button:has-text("Clear All")',
        'button:has-text("Reset")',
        '[class*="clear"]',
        '[class*="reset"]',
        '[title*="Clear"]',
        '[title*="Reset"]'
      ];
      
      let clearButton = null;
      for (const selector of clearButtonSelectors) {
        const elements = page.locator(selector);
        const count = await elements.count();
        
        for (let i = 0; i < count; i++) {
          const element = elements.nth(i);
          if (await element.isVisible()) {
            clearButton = element;
            console.log(`✓ Found clear button with selector: ${selector}`);
            break;
          }
        }
        if (clearButton) break;
      }
      
      if (clearButton) {
        await clearButton.click();
        console.log('✓ Clicked clear button');
        
        // Check if input is cleared
        await page.waitForTimeout(500);
        const inputValue = await singlishInput.inputValue();
        const actualOutput = inputValue || '';
        
        return { 
          passed: actualOutput === '', 
          actualOutput: actualOutput,
          uiTest: true
        };
      } else {
        throw new Error('Clear button not found');
      }
    } else {
      // For functional tests: Enter text and get output
      await singlishInput.fill(testCase.input);
      console.log(`✓ Entered input: "${testCase.input}"`);
      
      // 4. Wait for conversion (longer for complex sentences)
      if (testCase.inputLength === 'L') {
        await page.waitForTimeout(3000);
      } else {
        await page.waitForTimeout(2000);
      }
      
      // 5. Locate the Sinhala output field
      const outputSelectors = [
        'textarea[readonly]',
        'input[readonly]',
        '[contenteditable="false"]',
        '[placeholder*="Sinhala"]',
        '[id*="output"]',
        '[class*="output"]',
        '[id*="result"]',
        '[class*="result"]',
        '.sinhala-output',
        '#sinhala-output',
        'pre',
        'code'
      ];
      
      let sinhalaOutput = null;
      for (const selector of outputSelectors) {
        const elements = page.locator(selector);
        const count = await elements.count();
        
        for (let i = 0; i < count; i++) {
          const element = elements.nth(i);
          if (await element.isVisible()) {
            sinhalaOutput = element;
            console.log(`✓ Found output field with selector: ${selector} [index: ${i}]`);
            break;
          }
        }
        if (sinhalaOutput) break;
      }
      
      // 6. Get the actual output text
      let actualOutput = '';
      
      if (sinhalaOutput) {
        // Try different methods to get text
        try {
          actualOutput = await sinhalaOutput.inputValue();
        } catch {
          try {
            actualOutput = await sinhalaOutput.textContent();
          } catch {
            actualOutput = await sinhalaOutput.innerText();
          }
        }
        actualOutput = actualOutput.trim();
      } else {
        // Fallback: Search for Sinhala text anywhere on page
        const body = page.locator('body');
        const bodyText = await body.textContent() || '';
        
        // Extract Sinhala text (Unicode range for Sinhala)
        const sinhalaRegex = /[\u0D80-\u0DFF][\u0D80-\u0DFF\s\.,!?\:\;\-\|\"\'\(\)]*[\u0D80-\u0DFF]/g;
        const matches = bodyText.match(sinhalaRegex);
        
        if (matches && matches.length > 0) {
          // Find the longest Sinhala text (likely the main output)
          matches.sort((a, b) => b.length - a.length);
          actualOutput = matches[0].trim();
          console.log(`✓ Extracted Sinhala text from body (${matches.length} matches found)`);
        } else {
          // Last resort: Get all text and look for Sinhala
          const allText = bodyText;
          const lines = allText.split('\n').filter(line => line.trim().length > 0);
          
          for (const line of lines) {
            if (line.includes('ම') || line.includes('ක') || line.includes('ත')) {
              actualOutput = line.trim();
              break;
            }
          }
        }
      }
      
      console.log(`✓ Actual output: "${actualOutput}"`);
      
      // 7. Compare with expected output
      const normalizedActual = actualOutput.replace(/\s+/g, ' ').trim();
      const normalizedExpected = testCase.expectedOutput.replace(/\s+/g, ' ').trim();
      
      let passed = false;
      let matchType = 'none';
      
      if (testCase.isNegative) {
        // For negative tests, we expect them to fail
        if (normalizedActual !== normalizedExpected) {
          passed = true; // Negative test should NOT match exactly
          matchType = 'negative-expected-mismatch';
        } else {
          passed = false;
          matchType = 'negative-unexpected-match';
        }
      } else {
        // For positive tests
        if (normalizedActual === normalizedExpected) {
          passed = true;
          matchType = 'exact';
        } else if (normalizedActual.includes(normalizedExpected)) {
          passed = true;
          matchType = 'subset';
        } else if (normalizedExpected.includes(normalizedActual) && normalizedActual.length > 5) {
          passed = true;
          matchType = 'superset';
        } else {
          passed = false;
          matchType = 'mismatch';
        }
      }
      
      console.log(`🔍 Match type: ${matchType}`);
      console.log(passed ? '✅ TEST PASSED' : '❌ TEST FAILED');
      
      return { 
        passed, 
        actualOutput, 
        matchType,
        isNegative: testCase.isNegative
      };
      
    }
    
  } catch (error) {
    console.log(`❌ Test ${testCase.id} failed with error:`, error instanceof Error ? error.message : 'Unknown error');
    return { 
      passed: false, 
      actualOutput: '', 
      error: error instanceof Error ? error.message : 'Unknown error',
      matchType: 'error'
    };
  }
}

// Create individual test for each test case
for (const testCase of testCases) {
  test(`${testCase.id} - ${testCase.name}`, async ({ page }) => {
    const result = await runTestCase(page, testCase);
    
    // Take screenshot
    const screenshotPath = `test-results/${testCase.id}-${result.passed ? 'passed' : 'failed'}.png`;
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    console.log(`📸 Screenshot saved: ${screenshotPath}`);
    
    // For negative tests, we expect them to "pass" (meaning they fail as expected)
    if (testCase.isNegative) {
      // Negative test should NOT match exactly
      if (!result.passed) {
        console.log(`✅ NEGATIVE TEST PASSED AS EXPECTED: System failed to convert correctly`);
      } else {
        throw new Error(`Negative test ${testCase.id} should have failed but passed`);
      }
    } else {
      // Positive test should pass
      if (!result.passed) {
        throw new Error(`Test ${testCase.id} failed. Expected: "${testCase.expectedOutput}", Got: "${result.actualOutput}"`);
      }
    }
    
    console.log(`🎉 ${testCase.id} completed successfully!\n`);
  });
}

// Configuration test to verify website is accessible
test('Configuration Test: Verify website accessibility and structure', async ({ page }) => {
  console.log('🔧 Running configuration test...');
  
  await page.goto('https://www.swifttranslator.com/');
  await page.waitForLoadState('networkidle');
  
  // Check page title
  const title = await page.title();
  console.log(`📄 Page title: "${title}"`);
  
  // Check for key elements
  const hasInput = await page.locator('input, textarea, [contenteditable="true"]').count() > 0;
  console.log(`📝 Has input field: ${hasInput ? '✅' : '❌'}`);
  
  // Check for Sinhala text on page
  const bodyText = await page.locator('body').textContent() || '';
  const hasSinhala = /[\u0D80-\u0DFF]/.test(bodyText);
  console.log(`🔤 Has Sinhala text: ${hasSinhala ? '✅' : '❌'}`);
  
  // Save page source for debugging
  const html = await page.content();
  fs.writeFileSync('test-results/page-source.html', html);
  console.log('💾 Page source saved: test-results/page-source.html');
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/website-overview.png', fullPage: true });
  console.log('📸 Screenshot saved: test-results/website-overview.png');
  
  // Verify essential requirements
  expect(hasInput).toBeTruthy();
  expect(hasSinhala).toBeTruthy();
  expect(title).toBeTruthy();
  
  console.log('✅ Configuration test passed!');
});

// Summary test that runs all test cases
test('Summary: Run all test cases and generate report', async ({ page }) => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 BATCH TEST - Running all test cases');
  console.log('='.repeat(60));
  
  const results: any[] = [];
  
  for (const testCase of testCases) {
    console.log(`\n--- Running ${testCase.id}: ${testCase.name} ---`);
    
    try {
      const result = await runTestCase(page, testCase);
      
      results.push({
        id: testCase.id,
        name: testCase.name,
        input: testCase.input,
        expected: testCase.expectedOutput,
        actual: result.actualOutput,
        passed: result.passed,
        matchType: result.matchType,
        error: result.error,
        isNegative: testCase.isNegative,
        isUITest: testCase.isUITest
      });
      
      console.log(`${result.passed ? '✅' : '❌'} ${testCase.id}: ${result.passed ? 'PASSED' : 'FAILED'}`);
      
      // Delay between tests to avoid rate limiting
      await page.waitForTimeout(1000);
      
    } catch (error) {
      results.push({
        id: testCase.id,
        name: testCase.name,
        error: error instanceof Error ? error.message : 'Unknown error',
        passed: false
      });
      console.log(`💥 ${testCase.id}: ERROR - ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  // Generate summary report
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY REPORT');
  console.log('='.repeat(60));
  
  const totalTests = results.length;
  const passedTests = results.filter(r => r.passed).length;
  const failedTests = results.filter(r => !r.passed).length;
  const positiveTests = results.filter(r => !r.isNegative && !r.isUITest).length;
  const negativeTests = results.filter(r => r.isNegative).length;
  const uiTests = results.filter(r => r.isUITest).length;
  const positivePassed = results.filter(r => !r.isNegative && !r.isUITest && r.passed).length;
  const negativePassed = results.filter(r => r.isNegative && r.passed).length;
  const uiPassed = results.filter(r => r.isUITest && r.passed).length;
  
  console.log(`📈 Test Categories:`);
  console.log(`   Positive Functional Tests: ${positiveTests} (${positivePassed} passed)`);
  console.log(`   Negative Functional Tests: ${negativeTests} (${negativePassed} passed)`);
  console.log(`   UI Tests: ${uiTests} (${uiPassed} passed)`);
  console.log(`\n📊 Overall Results:`);
  console.log(`   Total Tests: ${totalTests}`);
  console.log(`   Passed: ${passedTests} (${((passedTests/totalTests)*100).toFixed(1)}%)`);
  console.log(`   Failed: ${failedTests} (${((failedTests/totalTests)*100).toFixed(1)}%)`);
  
  if (failedTests > 0) {
    console.log('\n❌ Failed Tests:');
    for (const result of results.filter(r => !r.passed)) {
      console.log(`   ${result.id}: ${result.name}`);
      if (result.error) {
        console.log(`      Error: ${result.error}`);
      } else if (result.expected && result.actual) {
        console.log(`      Expected: "${result.expected}"`);
        console.log(`      Actual:   "${result.actual}"`);
      }
    }
  }
  
  // Save detailed results to JSON file
  const report = {
    timestamp: new Date().toISOString(),
    totalTests,
    passedTests,
    failedTests,
    results: results.map(r => ({
      id: r.id,
      passed: r.passed,
      matchType: r.matchType,
      input: r.input,
      expected: r.expected,
      actual: r.actual,
      isNegative: r.isNegative,
      isUITest: r.isUITest
    }))
  };
  
  fs.writeFileSync('test-results/test-report.json', JSON.stringify(report, null, 2));
  console.log('\n💾 Detailed report saved: test-results/test-report.json');
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ BATCH TEST COMPLETED');
  console.log('='.repeat(60));
  
  // Final check: Ensure at least 80% of positive tests pass
  const positivePassRate = positiveTests > 0 ? (positivePassed / positiveTests) * 100 : 100;
  if (positivePassRate < 80) {
    throw new Error(`Only ${positivePassRate.toFixed(1)}% of positive tests passed (minimum 80% required)`);
  }
  
  console.log(`\n🎉 Overall test execution successful!`);
});