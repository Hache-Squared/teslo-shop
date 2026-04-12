import { SetMetadata } from "@nestjs/common"

export const META_PUBLIC = 'public';
export const Public = () => {
    return SetMetadata(META_PUBLIC, true);
}