import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Controller('staffs')
export class StaffsController {
  constructor(private readonly staffsService: StaffsService) {}

}
