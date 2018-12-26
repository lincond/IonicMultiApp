# Ionic Multi App

If you build many apps that uses the **same source code** with Ionic v3, this tool can help you to automate the build process and avoid copying splash and icons, modify app id, name and version.

## Installation

Clone the source
```bash
git clone https://github.com/lincond/IonicMultiApp
```

Install via npm
```bash
npm i -g
```

## Usage

### Generate config.xml

```bash
ima config [options] <config>
```

Build a new config.xml with provided data

**Options**:  
  **-i, --id** [id]      - specifies the application id. Ex.: br.com.example.app  
  **-n, --name** [name]  - specifies the application name. Ex.: My App  
  **-v, --appv** [appv]  - specifies the application version. Ex.: 0.0.1  
  **-o, --out** [out]    - specifies the name of out xml file.  
  **-h, --help**         - output usage information  

**Example**:

```bash
ima config -i com.myenterprise.myapp -n MyApp -v 1.0.1 -o new_config.xml config.xml
```
