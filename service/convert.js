import chrome from 'chrome-aws-lambda'
import { addExtra } from 'puppeteer-extra'
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker'

// Workaround, see https://github.com/berstend/puppeteer-extra/issues/93#issuecomment-712364816
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import ChromeAppPlugin from 'puppeteer-extra-plugin-stealth/evasions/chrome.app/index.js'
import ChromeCsiPlugin from 'puppeteer-extra-plugin-stealth/evasions/chrome.csi/index.js'
import ChromeLoadTimes from 'puppeteer-extra-plugin-stealth/evasions/chrome.loadTimes/index.js'
import ChromeRuntimePlugin from 'puppeteer-extra-plugin-stealth/evasions/chrome.runtime/index.js'
import IFrameContentWindowPlugin from 'puppeteer-extra-plugin-stealth/evasions/iframe.contentWindow/index.js'
import MediaCodecsPlugin from 'puppeteer-extra-plugin-stealth/evasions/media.codecs/index.js'
import NavigatorLanguagesPlugin from 'puppeteer-extra-plugin-stealth/evasions/navigator.languages/index.js'
import NavigatorPermissionsPlugin from 'puppeteer-extra-plugin-stealth/evasions/navigator.permissions/index.js'
import NavigatorPlugins from 'puppeteer-extra-plugin-stealth/evasions/navigator.plugins/index.js'
import NavigatorVendor from 'puppeteer-extra-plugin-stealth/evasions/navigator.vendor/index.js'
import NavigatorWebdriver from 'puppeteer-extra-plugin-stealth/evasions/navigator.webdriver/index.js'
import SourceUrlPlugin from 'puppeteer-extra-plugin-stealth/evasions/sourceurl/index.js'
import UserAgentOverridePlugin from 'puppeteer-extra-plugin-stealth/evasions/user-agent-override/index.js'
import WebglVendorPlugin from 'puppeteer-extra-plugin-stealth/evasions/webgl.vendor/index.js'
import WindowOuterDimensionsPlugin from 'puppeteer-extra-plugin-stealth/evasions/window.outerdimensions/index.js'

// Configure puppeteer-extra plugins
const puppeteer = addExtra(chrome.puppeteer)
const plugins = [
	AdblockerPlugin({ blockTrackers: true }),
	StealthPlugin(),
	ChromeAppPlugin(),
	ChromeCsiPlugin(),
	ChromeLoadTimes(),
	ChromeRuntimePlugin(),
	IFrameContentWindowPlugin(),
	MediaCodecsPlugin(),
	NavigatorLanguagesPlugin(),
	NavigatorPermissionsPlugin(),
	NavigatorPlugins(),
	NavigatorVendor(),
	NavigatorWebdriver(),
	SourceUrlPlugin(),
	UserAgentOverridePlugin(),
	WebglVendorPlugin(),
	WindowOuterDimensionsPlugin()
]

// Or just use puppeteer directly
// import puppeteer from 'puppeteer-core'

const isDev = process.env.NODE_ENV === 'development'

export async function getOptions() {
	const executablePath = await chrome.executablePath
	if (!executablePath) {
		// running locally
		const puppeteer = await import('puppeteer').then((m) => {
      return m.default;
    });
		return {
			args: chrome.args,
			headless: true,
			defaultViewport: {
				width: 1280,
				height: 720
			},
			ignoreHTTPSErrors: true
		};
	}

	return {
    args: chrome.args,
    defaultViewport: chrome.defaultViewport,
    executablePath: executablePath,
		headless: chrome.headless,
		ignoreHTTPSErrors: true
	};
}

export const getPdf = async (source, type = 'link') => {

	// Start headless chrome instance
	const options = await getOptions()
	const browser = await puppeteer.launch(options)

	// Load all plugins manually
	for (const plugin of plugins) {
		await plugin.onBrowser(browser)
	}

	const page = await browser.newPage()

	// Visit URL and wait until everything is loaded (available events: load, domcontentloaded, networkidle0, networkidle2)
	// or, handle HTML directly that it's been told to render
	if (type == 'link') {
		await page.goto(source, { waitUntil: 'networkidle2', timeout: 10000 })
	}
	else {
		await page.setContent(source,{ waitUntil: 'networkidle0', timeout: 10000 });
	}

	// Scroll to bottom of page to force loading of lazy loaded images
	await page.evaluate(async () => {
		await new Promise((resolve) => {
			let totalHeight = 0
			const distance = 100
			const timer = setInterval(() => {
				const scrollHeight = document.body.scrollHeight
				window.scrollBy(0, distance)
				totalHeight += distance

				if (totalHeight >= scrollHeight) {
					clearInterval(timer)
					resolve()
				}
			}, 5)
		})
	})

	// Tell Chrome to generate the PDF
	await page.emulateMediaType('screen')
	const buffer = await page.pdf({
		format: 'A4',
		displayHeaderFooter: true,
		headerTemplate: '',
		footerTemplate: '',
		printBackground: true,
		margin: {
			top: 20,
			left: 20,
			right: 20,
			bottom: 20
		}
	})

	// Close chrome instance
	await browser.close()

	return buffer
}