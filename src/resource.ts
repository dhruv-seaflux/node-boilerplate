/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/indent */
import fs from "fs";
import path from "path";

function generateDto(fileName: string, includeMemberId = false) {
  return `
import { IsInt } from "class-validator";

export class ${fileName} {
${
  includeMemberId
    ? `
  @IsInt()
  memberId: number;
`
    : `
  @IsInt()
  id: number;
`
}
}
`;
}

// Get the folder name from command-line arguments
const folderName = process.argv[2];

// Check if folder name is provided
if (!folderName) {
  console.error("Please provide a folder name.");
  process.exit(1);
}

// Define folder paths
const folderPath = path.join(__dirname, "modules", folderName);
const dtoFolderPath = path.join(folderPath, "dto");
const helpersFolderPath = path.join(folderPath, "helpers");

// Define file names
const folderPascalCase = folderName.charAt(0).toUpperCase() + folderName.slice(1);
const folderSmallCase = folderName.toLowerCase();
const folderUpperCase = folderName.toUpperCase();

const indexFileContent = `export * from './${folderName}.route';\nexport * from './${folderName}.controller';`;

const dtoIndexFileContent = `
export * from './create-${folderSmallCase}.dto';
export * from './update-${folderSmallCase}.dto';
export * from './get-${folderSmallCase}.dto';
export * from './get-${folderSmallCase}-with-filter.dto';
export * from './delete-${folderSmallCase}.dto';
`;

const routeFileContent = `
import { RouterDelegates } from "@/types";
import { InjectCls, SFRouter, Validator } from "@/helpers";
import { AuthMiddleware } from "@middlewares";
import { Create${folderPascalCase}Dto, Update${folderPascalCase}Dto, Get${folderPascalCase}Dto, Get${folderPascalCase}WithFilterDto, Delete${folderPascalCase}Dto } from "./dto";
import { ${folderPascalCase}Controller } from "./${folderName.toLowerCase()}.controller";

export class ${folderPascalCase}Router extends SFRouter implements RouterDelegates {
  @InjectCls(${folderPascalCase}Controller)
  private ${folderSmallCase}Controller: ${folderPascalCase}Controller;

  @InjectCls(AuthMiddleware)
  private authMiddleware: AuthMiddleware;

  initRoutes(): void {
    this.router.post("/", this.authMiddleware.auth, Validator.validate(Create${folderPascalCase}Dto), this.${folderSmallCase}Controller.create${folderPascalCase});
    this.router.put("/", this.authMiddleware.auth, Validator.validate(Update${folderPascalCase}Dto), this.${folderSmallCase}Controller.update${folderPascalCase});
    this.router.get("/", this.authMiddleware.auth, Validator.validate(Get${folderPascalCase}Dto), this.${folderSmallCase}Controller.get${folderPascalCase}WithFilter);
    this.router.get("/${folderName}/:${folderName}Id", this.authMiddleware.auth, Validator.validate(Get${folderPascalCase}WithFilterDto), this.${folderSmallCase}Controller.get${folderPascalCase}WithFilter);
    this.router.delete("/${folderName}/:${folderName}Id", Validator.validate(Delete${folderPascalCase}Dto), this.${folderSmallCase}Controller.delete${folderPascalCase});
  }
}
`;

const controllerFileContent = `
import { Repository } from "typeorm";
import * as l10n from "jm-ez-l10n";
import { TRequest, TResponse } from "@/types";
import { ${folderPascalCase}Entity } from "@entities";
import { InitRepository, InjectCls, InjectRepositories } from "@helpers";
import { BaseController } from "@modules/base.controller";
import { ${folderPascalCase}Helper } from "./helpers/${folderSmallCase}.helper";
import { Create${folderPascalCase}Dto, Update${folderPascalCase}Dto, Get${folderPascalCase}Dto, Get${folderPascalCase}WithFilterDto, Delete${folderPascalCase}Dto } from "./dto";

export class ${folderPascalCase}Controller extends BaseController {
  @InitRepository(${folderPascalCase}Entity)
  ${folderSmallCase}Repository: Repository<${folderPascalCase}Entity>;

  @InjectCls(${folderPascalCase}Helper)
  private ${folderSmallCase}Helper: ${folderPascalCase}Helper;

  constructor() {
    super();
    InjectRepositories(this);
  }

  public create${folderPascalCase} = async (req: TRequest<Create${folderPascalCase}Dto>, res: TResponse) => {
    const { id } = req.dto as Create${folderPascalCase}Dto;
    
    await this.${folderSmallCase}Helper.exampleHelper("parameter");
    
    return res.status(201).json({ message: l10n.t("${folderUpperCase}_CREATED") });
  };

  public update${folderPascalCase} = async (req: TRequest<Update${folderPascalCase}Dto>, res: TResponse) => {
    const { id } = req.dto as Update${folderPascalCase}Dto;
    return res.status(200).json({ message: l10n.t("${folderUpperCase}_UPDATED") });
  };

  public get${folderPascalCase}ById = async (req: TRequest<Get${folderPascalCase}Dto>, res: TResponse) => {
    const { ${folderName}Id } = req.dto as Get${folderPascalCase}Dto;

    const ${folderName}Details = await this.${folderSmallCase}Repository.findOne({ where: { id: Number(${folderName}Id)} });
    return res.status(200).json(${folderName}Details);
  };

  public get${folderPascalCase}WithFilter = async (req: TRequest<Get${folderPascalCase}WithFilterDto>, res: TResponse) => {
    const { id } = req.dto as Get${folderPascalCase}WithFilterDto;
    
    const ${folderName}Details = await this.${folderSmallCase}Repository.findAndCount({ where: { id } });
    return res.status(200).json({ count: ${folderName}Details.at(1), ${folderName}Details: ${folderName}Details.at(0) });
  };

  public delete${folderPascalCase} = async (req: TRequest<Delete${folderPascalCase}Dto>, res: TResponse) => {
    const { ${folderName}Id } = req.dto as Delete${folderPascalCase}Dto;
    await this.${folderSmallCase}Repository.delete({ id: Number(${folderName}Id)});
    return res.status(200).json({ message: l10n.t("${folderUpperCase}_DELETED") });
  };
}
`;

const helperIndexContent = `export * from './${folderName}.helper';`;
const helperFileContent = `
export class ${folderPascalCase}Helper {
    public async exampleHelper(parameters: any) {
        return true;
    }
}
`;

// Check if parent directory exists, create if it doesn't
const parentFolderPath = path.join(__dirname, "modules");

if (!fs.existsSync(parentFolderPath)) {
  fs.mkdirSync(parentFolderPath, { recursive: true });
}

// Create folder and files
if (!fs.existsSync(folderPath)) {
  try {
    fs.mkdirSync(folderPath);
    fs.mkdirSync(dtoFolderPath);
    fs.mkdirSync(helpersFolderPath);

    fs.writeFileSync(path.join(folderPath, "index.ts"), indexFileContent);
    console.log(`✅ File created: index.ts`);

    fs.writeFileSync(path.join(dtoFolderPath, "index.ts"), dtoIndexFileContent);
    console.log(`✅ File created: dto/index.ts`);

    fs.writeFileSync(path.join(helpersFolderPath, "index.ts"), helperIndexContent);
    console.log(`✅ File created: helpers/index.ts`);

    fs.writeFileSync(path.join(dtoFolderPath, `create-${folderSmallCase}.dto.ts`), generateDto(`Create${folderPascalCase}Dto`));
    console.log(`✅ File created: dto/create-${folderSmallCase}.dto.ts`);

    fs.writeFileSync(path.join(dtoFolderPath, `update-${folderSmallCase}.dto.ts`), generateDto(`Update${folderPascalCase}Dto`));
    console.log(`✅ File created: dto/update-${folderSmallCase}.dto.ts`);

    fs.writeFileSync(path.join(dtoFolderPath, `get-${folderSmallCase}.dto.ts`), generateDto(`Get${folderPascalCase}Dto`, true));
    console.log(`✅ File created: dto/get-${folderSmallCase}.dto.ts`);

    fs.writeFileSync(path.join(dtoFolderPath, `get-${folderSmallCase}-with-filter.dto.ts`), generateDto(`Get${folderPascalCase}WithFilterDto`));
    console.log(`✅ File created: dto/get-${folderSmallCase}-with-filter.dto.ts`);

    fs.writeFileSync(path.join(dtoFolderPath, `delete-${folderSmallCase}.dto.ts`), generateDto(`Delete${folderPascalCase}Dto`, true));
    console.log(`✅ File created: dto/delete-${folderSmallCase}.dto.ts`);

    fs.writeFileSync(path.join(helpersFolderPath, `${folderName}.helper.ts`), helperFileContent);
    console.log(`✅ File created: helpers/${folderName}.helper.ts`);

    fs.writeFileSync(path.join(folderPath, `${folderName}.route.ts`), routeFileContent);
    console.log(`✅ File created: ${folderName}.route.ts`);

    fs.writeFileSync(path.join(folderPath, `${folderName}.controller.ts`), controllerFileContent);
    console.log(`✅ File created: ${folderName}.controller.ts`);

    console.log(`🎉 Folder "${folderName}" created successfully.`);
  } catch (error) {
    console.error("❌ Error creating folder or files:", error);
  }
} else {
  console.log(`❌ Folder "${folderName}" already exists.`);
}
