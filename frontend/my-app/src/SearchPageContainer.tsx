import React from "react";
import {
  FormControl,
  InputGroup,
  Container,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import LinksList from "./LinksList";

export type TFileObject = {
  [fileTitle: string]: string;
};

export interface ISearchContainerState {
  filesData: TFileObject[];
  loading: boolean;
}

class SearchPageContainer extends React.Component<{}, ISearchContainerState> {
  constructor(props: any) {
    super(props);

    this.inputRef = React.createRef();

    this.state = {
      filesData: [],
      loading: false,
    };

    this.search = this.search.bind(this);
  }

  private inputRef: any;

  private search() {
    this.setState({ loading: true });
    fetch(`http://localhost:5000/send/${this.inputRef.current.value}`)
      .then((res) => {
        return res.json();
      })
      .catch((err) => {
        this.setState({ loading: false });
      })
      .then((data) => {
        this.setState({ filesData: data, loading: false });
      });
  }

  render() {
    const { filesData, loading } = this.state;

    return (
      <Container>
        <Row className="mt-3">
          <Col style={{ display: "flex", flexDirection: "column" }}>
            <InputGroup className="mb-3">
              <InputGroup.Text id="query-input">🔍</InputGroup.Text>
              <FormControl
                ref={this.inputRef}
                placeholder="Введите ваш запрос"
                aria-label="Query"
                aria-describedby="query-input"
              />
            </InputGroup>
            <LinksList filesData={filesData} isLoading={loading} />
          </Col>
          <Col>
            <Button onClick={this.search}>Найти</Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SearchPageContainer;
