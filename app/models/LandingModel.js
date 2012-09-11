//Model structuring the LandingStore.
Ext.regModel('LandingModel',
{
	fields:
    [
		{ name: 'id', type: 'string' },
		{ name: 'title', type: 'string' },
		{ name: 'narrative', type: 'string' }
	], 
	validations:
    [
		{ type: 'presence', field: 'title' } 
	]
});