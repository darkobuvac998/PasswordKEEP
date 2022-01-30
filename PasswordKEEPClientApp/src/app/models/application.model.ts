import { Account } from "./account.model";
import { PrimaryKey } from "../decorators/property.decorator";

export class Application{
    @PrimaryKey()
    public id: string | null = null;
    public name: string | null = null;
    public url: string | null = null;
    public accounts : Account[] = [];
}