class ReportDTO {
  constructor(report) {
    this.id = report.id;
    this.reporter_id = report.reporter_id;
    this.provider_id = report.provider_id;
    this.content = report.content;
    this.status = report.status;
    this.created_at = report.created_at;
    this.updated_at = report.updated_at;

    if (report.reporter?.user) {
      this.reporter_name = report.reporter.user.name;
    }
    if (report.reporter?.user) {
      this.provider_name = report.provider.user.name;
    }
  }

  static fromModel(report) {
    return new ReportDTO(report);
  }

  static fromList(reports) {
    return reports.map((r) => new ReportDTO(r));
  }
}

module.exports = { ReportDTO };
