import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { generateId } from "src/utilities";
import { EventCategory, EventCategoryDocument } from "./schemas/event-category.schema";



@Injectable()
export class EventCategoryService {
  constructor(
    @InjectModel(EventCategory.name) private eventCategoryModel: Model<EventCategoryDocument>
  ) { }

  async addCategory(name: string) {
    const exists = await this.eventCategoryModel.exists({ name: name.toLowerCase() });

    if (exists) {
      throw new BadRequestException('Category exists with this name');
    }

    const category = await this.eventCategoryModel.create({
      id: generateId(),
      name: name.toLowerCase(),
    })

    if (!category) {
      throw new BadRequestException('Cannot create category now. Please try again later');
    }

    return category.toDto();
  }

  async listCategories() {
    const categories = await this.eventCategoryModel.find();
    return categories.map(category => category.toDto())
  }

  async deleteCategory(name: string) {
    console.log(name);
    const { deletedCount } = await this.eventCategoryModel.deleteOne({ name: name.toLowerCase() });

    if (deletedCount === 1) {
      throw new BadRequestException('failed to delete category');
    };

    return true;
  }
}