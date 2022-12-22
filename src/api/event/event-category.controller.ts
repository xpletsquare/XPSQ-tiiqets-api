import { Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { SuccessResponse } from "src/utilities/successMessage";
import { EventCategoryService } from "./event-category.service";

@Controller("event-category")
export class EventCategoryController {
  constructor(private eventCategoryService: EventCategoryService) {}

  @Get()
  async getEventCategories() {
    const categories = await this.eventCategoryService.listCategories();
    return new SuccessResponse("success", categories);
  }

  @Post(":name")
  async addCategory(@Param("name") name: string) {
    const categoryInfo = await this.eventCategoryService.addCategory(name);
    return new SuccessResponse("success", categoryInfo);
  }

  @Delete(":name")
  async deleteCategory(@Param("name") name: string) {
    await this.eventCategoryService.deleteCategory(name);
    return new SuccessResponse("event category deleted");
  }
}
