/**
 * WordPress dependencies
 */

const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( 'Using Hooks API', () => {
	test.beforeAll( async ( { requestUtils } ) => {
		await requestUtils.activatePlugin( 'gutenberg-test-hooks-api' );
	} );

	test.afterAll( async ( { requestUtils } ) => {
		await requestUtils.deactivatePlugin( 'gutenberg-test-hooks-api' );
	} );

	test.beforeEach( async ( { admin } ) => {
		await admin.createNewPost();
	} );

	test( 'Should contain a reset block button on the sidebar', async ( {
		editor,
		page,
	} ) => {
		await page.click( 'role=button[name="Add default block"i]' );
		await page.keyboard.type( 'First paragraph' );
		await editor.switchBlockInspectorTab( 'Settings' );
		await expect(
			page.locator( 'role=button[name="Reset Block"i]' )
		).toBeVisible();
	} );

	test( 'Pressing reset block button resets the block', async ( {
		editor,
		page,
	} ) => {
		await page.click( 'role=button[name="Add default block"i]' );
		await page.keyboard.type( 'First paragraph' );

		const paragraphBlock = page.locator(
			'role=document[name="Paragraph block"i]'
		);
		await expect( paragraphBlock ).toHaveText( 'First paragraph' );
		await editor.switchBlockInspectorTab( 'Settings' );
		await page.click( 'role=button[name="Reset Block"i]' );
		expect( await editor.getEditedPostContent() ).toEqual( '' );
	} );
} );
