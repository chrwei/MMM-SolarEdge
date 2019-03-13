# MMM-SolarEdge
A Solar Module for MagicMirror2 designed to integrate with an SolarEdge inverter 

## Dependencies
  * A [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror) installation

## Installation
  1. Clone repo into MagicMirror/modules directory
  2. Get an SolarEdge API key 
  3. Create an entry in 'config/config.js' with your API Key, SiteID, and any config options.

 **Example:**
```
 {
    module: 'MMM-SolarEdge',
	position: 'bottom_left',
	config: {
		apiKey: "################################", //Requires your own API Key
		siteId: "67", //Site ID 
	}
 },
```
**Note:** Only enter your API Key in the `config.js` file. Your API Key is yours alone, _do not_ post or use it elsewhere.

## Sample
![alt text](https://github.com/chrwei/MMM-SolarEdge/blob/master/AppSample.PNG "Example")

## Optional Config
| **Option** | **Description** |
| --- | --- |
| `basicHeader` | Set to `true` to substitute the 'SolarEdge' text and graphic for the default MagicMirror header |

## API Key
Use of this module requires
  1. An API Key, which you can obtain from installer 
  2. The Site ID of the solar system you wish to monitor, which can also be found in the Monitoring Portal.

## Attribution
