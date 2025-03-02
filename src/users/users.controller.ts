import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { v4 as uuidv4 } from 'uuid';

import { FileInterceptor } from '@nestjs/platform-express';
import { uploadFileDto } from './dto/uploadFileBody.dto';
import { UserId } from './decorators/user.decorator';
import { AuthUsersGuards } from 'src/auth/guards/authUser.guard';

@Controller('users')
@UseGuards(AuthUsersGuards)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post('/getFile')
  getFile(@Body('filePath') filePath: string) {
    return this.usersService.getFile(filePath);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post('/uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UserId() id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() visibleOnlyFor: uploadFileDto,
  ) {
    const path = uuidv4().toString();

    const filePath = `files/${file.originalname ? file.originalname : path}`;

    return this.usersService.uploadFile(
      filePath,
      file.buffer,
      id,
      visibleOnlyFor,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
